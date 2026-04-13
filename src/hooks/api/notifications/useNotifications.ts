"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { normalizeApiResponse } from "@/lib/api/normalizeApiResponse";
import { queryKeys } from "../queryKeys";
import {
  INotification,
  NotificationListResponse,
  NotificationQueryParams,
  UnreadCountPayload,
} from "@/types/notification.types";
import { chatSocketManager } from "@/lib/chat/socketManager";
import { useAuthTokens, useUser } from "@/store/useUserStore";
import { getApiErrorMessage } from "@/lib/api-error";

const DEFAULT_LIMIT = 20;
const POLL_INTERVAL = 30000; // 30 seconds
const NOTIFICATION_UNREAD_ENDPOINT = ENDPOINT.NOTIFICATION.GET_UNREAD_COUNT;

const normalizeNotificationItem = (payload: unknown): INotification => {
  const item = (payload ?? {}) as Partial<INotification> & {
    receiverId?: string;
    senderId?: string;
  };

  const metadata =
    item.metadata && typeof item.metadata === "object"
      ? (item.metadata as Record<string, unknown>)
      : undefined;

  return {
    id: item.id ?? "",
    type: item.type ?? "SYSTEM",
    message: item.message ?? "",
    receiverId: item.receiverId ?? item.userId ?? "",
    senderId:
      item.senderId ??
      (typeof metadata?.senderId === "string" ? metadata.senderId : undefined),
    userId: item.userId ?? item.receiverId ?? "",
    title: item.title ?? "Notification",
    isRead: Boolean(item.isRead),
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt,
    priority: item.priority,
    actionUrl: item.actionUrl,
    actionLabel: item.actionLabel,
    metadata,
  };
};

const normalizeNotificationList = (payload: unknown): NotificationListResponse => {
  const normalized = normalizeApiResponse<unknown>(payload, []);

  if (Array.isArray(normalized.data)) {
    return {
      notifications: normalized.data.map((item) => normalizeNotificationItem(item)),
      meta: normalized.meta as NotificationListResponse["meta"],
    };
  }

  if (normalized.data && typeof normalized.data === "object") {
    const dataObject = normalized.data as {
      notifications?: unknown;
      items?: unknown;
    };

    const candidate = Array.isArray(dataObject.notifications)
      ? dataObject.notifications
      : Array.isArray(dataObject.items)
        ? dataObject.items
        : [];

    return {
      notifications: candidate.map((item) => normalizeNotificationItem(item)),
      meta: normalized.meta as NotificationListResponse["meta"],
    };
  }

  return { notifications: [], meta: normalized.meta as NotificationListResponse["meta"] };
};

const normalizeUnreadCount = (payload: unknown) => {
  const normalized = normalizeApiResponse<unknown>(payload, { unreadCount: 0 });

  if (normalized.data && typeof normalized.data === "object" && "unreadCount" in normalized.data) {
    const value = Number(
      (normalized.data as { unreadCount?: number | string }).unreadCount ?? 0,
    );

    return {
      unreadCount: Number.isFinite(value) ? value : 0,
    };
  }

  const value = Number(normalized.data);
  return {
    unreadCount: Number.isFinite(value) ? value : 0,
  };
};

/**
 * Hook to fetch notifications with pagination
 * Supports filtering by type, read status, and sorting
 */
export const useNotificationsQuery = (params: NotificationQueryParams = {}) => {
  const { page = 1, limit = DEFAULT_LIMIT, ...filters } = params;

  return useQuery({
    queryKey: queryKeys.notifications.list({ page, limit, ...filters }),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(
        ENDPOINT.NOTIFICATION.GET_NOTIFICATIONS,
        {
          params: { page, limit, ...filters },
        }
      );
      return normalizeNotificationList(response.data);
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 2,
  });
};

/**
 * Hook to get unread notification count
 * Refetches on interval to stay in sync
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: async () => {
      const response = await httpClient.get<unknown>(NOTIFICATION_UNREAD_ENDPOINT);
      return normalizeUnreadCount(response.data);
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: POLL_INTERVAL,
    retry: 1,
  });
};

/**
 * Mutation to mark notification as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await httpClient.patch<unknown>(
        ENDPOINT.NOTIFICATION.MARK_AS_READ(notificationId)
      );

      const normalized = normalizeApiResponse<unknown>(response.data, {});
      return normalizeNotificationItem(normalized.data);
    },
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.notifications.list({ page: 1, limit: DEFAULT_LIMIT }),
      });

      await queryClient.cancelQueries({
        queryKey: queryKeys.notifications.unreadCount,
      });

      const previousList = queryClient.getQueryData<NotificationListResponse>(
        queryKeys.notifications.list({ page: 1, limit: DEFAULT_LIMIT }),
      );

      const previousUnread = queryClient.getQueryData<{ unreadCount: number }>(
        queryKeys.notifications.unreadCount,
      );

      if (previousList) {
        queryClient.setQueryData<NotificationListResponse>(
          queryKeys.notifications.list({ page: 1, limit: DEFAULT_LIMIT }),
          {
            ...previousList,
            notifications: previousList.notifications.map((notification) =>
              notification.id === notificationId
                ? { ...notification, isRead: true }
                : notification,
            ),
          },
        );
      }

      if (previousUnread) {
        queryClient.setQueryData(queryKeys.notifications.unreadCount, {
          unreadCount: Math.max(0, previousUnread.unreadCount - 1),
        });
      }

      return { previousList, previousUnread };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<NotificationListResponse>(
        queryKeys.notifications.list({ page: 1, limit: DEFAULT_LIMIT }),
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            notifications: oldData.notifications.map((notification) =>
              notification.id === data.id ? { ...notification, isRead: true } : notification,
            ),
          };
        },
      );
    },
    onError: (error, _, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(
          queryKeys.notifications.list({ page: 1, limit: DEFAULT_LIMIT }),
          context.previousList,
        );
      }

      if (context?.previousUnread) {
        queryClient.setQueryData(queryKeys.notifications.unreadCount, context.previousUnread);
      }

      console.error("[useMarkAsRead] Error:", getApiErrorMessage(error));
    },
  });
};

/**
 * Comprehensive notifications hook with socket integration
 * Handles fetching, real-time updates, polling fallback
 */
interface UseNotificationsOptions {
  enablePolling?: boolean;
  enableSocket?: boolean;
  limit?: number;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const {
    enablePolling = true,
    enableSocket = true,
    limit = DEFAULT_LIMIT,
  } = options;

  const user = useUser();
  const { sessionToken, accessToken } = useAuthTokens();
  const socketToken = accessToken || sessionToken;
  const queryClient = useQueryClient();
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const socketListenersRef = useRef<{ event: string; handler: Function }[]>([]);
  const processedNotificationNewIdsRef = useRef<Set<string>>(new Set());
  const processedNotificationReadIdsRef = useRef<Set<string>>(new Set());

  // Query for notifications
  const notificationsQuery = useNotificationsQuery({
    page: 1,
    limit,
  });

  // Query for unread count
  const unreadCountQuery = useUnreadCount();

  /**
   * Start polling fallback (when socket is disconnected)
   */
  const startPolling = useCallback(() => {
    if (!enablePolling || pollIntervalRef.current) return;

    pollIntervalRef.current = setInterval(() => {
      void queryClient.refetchQueries({
        queryKey: queryKeys.notifications.list({ page: 1, limit }),
      });

      void queryClient.refetchQueries({
        queryKey: queryKeys.notifications.unreadCount,
      });
    }, POLL_INTERVAL);
  }, [enablePolling, queryClient, limit]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  /**
   * Setup socket listeners
   */
  const setupSocketListeners = useCallback(() => {
    if (!enableSocket || !socketToken) return;

    try {
      const socket =
        chatSocketManager.getSocket() ?? chatSocketManager.connect(socketToken);

      if (!socket) return;

      chatSocketManager.updateToken(socketToken);

      // Handle new notifications
      const onNewNotification = (payload: INotification) => {
        const normalizedPayload = normalizeNotificationItem(payload);

        if (!normalizedPayload.id) {
          return;
        }

        if (processedNotificationNewIdsRef.current.has(normalizedPayload.id)) {
          return;
        }

        processedNotificationNewIdsRef.current.add(normalizedPayload.id);
        
        queryClient.setQueryData(
          queryKeys.notifications.list({ page: 1, limit }),
          (oldData: NotificationListResponse | undefined) => {
            if (!oldData) {
              return {
                notifications: [normalizedPayload],
              };
            }

            if (oldData.notifications.some((item) => item.id === normalizedPayload.id)) {
              return oldData;
            }

            return {
              ...oldData,
              notifications: [normalizedPayload, ...oldData.notifications],
            };
          }
        );

        // Update unread count
        queryClient.setQueryData(
          queryKeys.notifications.unreadCount,
          (oldData: { unreadCount?: number } | undefined) => {
            if (normalizedPayload.isRead) {
              return oldData ?? { unreadCount: 0 };
            }

            return {
              unreadCount: (oldData?.unreadCount ?? 0) + 1,
            };
          }
        );
      };

      // Handle notification read event
      const onNotificationRead = (payload: {
        notificationId?: string;
        id?: string;
        updatedCount?: number;
      }) => {
        const notificationId = payload.notificationId || payload.id;

        if (!notificationId) {
          return;
        }

        if (processedNotificationReadIdsRef.current.has(notificationId)) {
          return;
        }

        processedNotificationReadIdsRef.current.add(notificationId);

        let shouldDecrementUnread = false;

        queryClient.setQueryData<NotificationListResponse>(
          queryKeys.notifications.list({ page: 1, limit }),
          (oldData) => {
            if (!oldData) {
              return oldData;
            }

            return {
              ...oldData,
              notifications: oldData.notifications.map((notification) => {
                if (notification.id !== notificationId) {
                  return notification;
                }

                if (!notification.isRead) {
                  shouldDecrementUnread = true;
                }

                return { ...notification, isRead: true };
              }),
            };
          },
        );

        if (!shouldDecrementUnread) {
          return;
        }

        queryClient.setQueryData(
          queryKeys.notifications.unreadCount,
          (oldData: { unreadCount?: number } | undefined) => ({
            unreadCount: Math.max(0, (oldData?.unreadCount ?? 0) - 1),
          })
        );
      };

      // Handle unread count update
      const onUnreadCountUpdate = (payload: UnreadCountPayload) => {
        queryClient.setQueryData(
          queryKeys.notifications.unreadCount,
          { unreadCount: payload.unreadCount }
        );
      };

      // Backward and forward compatible socket event names
      socket.on("notification:new", onNewNotification);
      socket.on("notification:read", onNotificationRead);
      socket.on("notification:unread-count", onUnreadCountUpdate);

      socketListenersRef.current = [
        { event: "notification:new", handler: onNewNotification },
        { event: "notification:read", handler: onNotificationRead },
        { event: "notification:unread-count", handler: onUnreadCountUpdate },
      ];

      stopPolling(); // Stop polling when socket is available
    } catch (err) {
      console.error("[Notifications] Socket setup error:", err);
      startPolling(); // Fallback to polling
    }
  }, [enableSocket, socketToken, queryClient, limit, stopPolling, startPolling]);

  /**
   * Cleanup socket listeners
   */
  const cleanupSocketListeners = useCallback(() => {
    try {
      const socket = chatSocketManager.getSocket();
      if (!socket) return;

      socketListenersRef.current.forEach(({ event, handler }) => {
        socket.off(event, handler as any);
      });
      socketListenersRef.current = [];
    } catch (err) {
      console.error("[Notifications] Cleanup error:", err);
    }
  }, []);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    cleanupSocketListeners();
    stopPolling();

    if (!user || !socketToken) {
      return;
    }

    // Start with polling
    startPolling();

    // Setup socket when available
    setupSocketListeners();

    return () => {
      cleanupSocketListeners();
      stopPolling();
    };
  }, [
    user?.id,
    socketToken,
    startPolling,
    stopPolling,
    setupSocketListeners,
    cleanupSocketListeners,
  ]);

  /**
   * Refetch notifications
   */
  const refetch = useCallback(async () => {
    await Promise.all([
      notificationsQuery.refetch(),
      unreadCountQuery.refetch(),
    ]);
  }, [notificationsQuery, unreadCountQuery]);

  return {
    // Data
    notifications: notificationsQuery.data?.notifications ?? [],
    unreadCount: unreadCountQuery.data?.unreadCount ?? 0,
    total: notificationsQuery.data?.meta?.total ?? 0,

    // States
    isLoading: notificationsQuery.isPending || unreadCountQuery.isPending,
    isFetching: notificationsQuery.isFetching || unreadCountQuery.isFetching,
    isError: notificationsQuery.isError || unreadCountQuery.isError,

    // Methods
    refetch,
    markAsRead: useMarkAsRead(),
  };
};
