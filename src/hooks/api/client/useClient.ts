import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse, PaginatedMeta } from "@/types/api.types";
import type {
  AddClientQueryReplyPayload,
  ClientDashboardSummary,
  ClientOrderDetail,
  ClientOrderListItem,
  ClientOrdersQueryParams,
  ClientQueriesQueryParams,
  ClientQueryDetail,
  ClientQueryListItem,
  ClientSettings,
  CreateClientQueryPayload,
  UpdateClientQueryPayload,
  UpdateClientSettingsPayload,
} from "@/types/client.types";
import { queryKeys } from "../queryKeys";

const normalizeArray = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object") {
    const objectPayload = payload as {
      data?: unknown;
      items?: unknown;
      results?: unknown;
    };

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as T[];
    }

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items as T[];
    }

    if (Array.isArray(objectPayload.results)) {
      return objectPayload.results as T[];
    }
  }

  return [];
};

const normalizeObject = <T extends object>(payload: unknown, fallback: T): T => {
  if (payload && typeof payload === "object") {
    const objectPayload = payload as {
      data?: unknown;
    };

    if (objectPayload.data && typeof objectPayload.data === "object") {
      return objectPayload.data as T;
    }

    return payload as T;
  }

  return fallback;
};

export const useClientDashboardSummary = () => {
  return useQuery({
    queryKey: queryKeys.client.dashboardSummary(),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.CLIENT.DASHBOARD_SUMMARY);

      return {
        ...response,
        data: normalizeObject<ClientDashboardSummary>(response.data, {
          orderCounts: {
            total: 0,
            active: 0,
            pending: 0,
            completed: 0,
            cancelled: 0,
            disputed: 0,
          },
          spending: {
            totalSpend: 0,
            monthSpend: 0,
            currency: "USD",
          },
          pendingActions: {
            pendingApprovals: 0,
            pendingDeliverableReviews: 0,
          },
          recentOrders: [],
          unreadMessagesCount: 0,
          unreadNotificationsCount: 0,
        }),
      } as ApiResponse<ClientDashboardSummary>;
    },
    staleTime: 1000 * 30,
    retry: 2,
  });
};

export const useClientOrders = (filters: ClientOrdersQueryParams = {}) => {
  return useQuery({
    queryKey: queryKeys.client.orderList(filters),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.CLIENT.ORDERS, {
        params: filters,
      });

      return {
        ...response,
        data: normalizeArray<ClientOrderListItem>(response.data),
        meta: response.meta as PaginatedMeta | undefined,
      } as ApiResponse<ClientOrderListItem[]>;
    },
    staleTime: 1000 * 30,
    retry: 2,
    placeholderData: (previous) => previous,
  });
};

export const useClientOrderDetail = (orderId?: string) => {
  return useQuery({
    queryKey: queryKeys.client.orderDetail(orderId || ""),
    enabled: Boolean(orderId),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.CLIENT.ORDER_DETAIL(orderId as string));

      return {
        ...response,
        data: normalizeObject<ClientOrderDetail>(response.data, {
          order: {
            id: "",
            title: "",
            amount: 0,
            currency: "USD",
            status: "PENDING",
            createdAt: "",
            updatedAt: "",
          },
          seller: {
            id: "",
            name: "",
          },
          phases: [],
          deliverablesSummary: {
            total: 0,
            submitted: 0,
            approved: 0,
            rejected: 0,
            pending: 0,
          },
          permittedActions: {
            canReviewDeliverables: false,
            canSendMessage: false,
            canRequestCancellation: false,
          },
        }),
      } as ApiResponse<ClientOrderDetail>;
    },
    staleTime: 1000 * 20,
    retry: 2,
  });
};

export const useClientQueries = (filters: ClientQueriesQueryParams = {}) => {
  return useQuery({
    queryKey: queryKeys.client.queryList(filters),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.CLIENT.QUERIES, {
        params: filters,
      });

      return {
        ...response,
        data: normalizeArray<ClientQueryListItem>(response.data),
        meta: response.meta as PaginatedMeta | undefined,
      } as ApiResponse<ClientQueryListItem[]>;
    },
    staleTime: 1000 * 20,
    retry: 2,
    placeholderData: (previous) => previous,
  });
};

export const useClientQueryDetail = (queryId?: string) => {
  return useQuery({
    queryKey: queryKeys.client.queryDetail(queryId || ""),
    enabled: Boolean(queryId),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.CLIENT.QUERY_DETAIL(queryId as string));

      return {
        ...response,
        data: normalizeObject<ClientQueryDetail>(response.data, {
          id: "",
          subject: "",
          description: "",
          category: "",
          priority: "LOW",
          status: "OPEN",
          attachmentUrls: [],
          createdAt: "",
          updatedAt: "",
          replies: [],
        }),
      } as ApiResponse<ClientQueryDetail>;
    },
    staleTime: 1000 * 10,
    retry: 2,
  });
};

export const useCreateClientQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateClientQueryPayload) => {
      return httpClient.post<ClientQueryDetail>(
        ENDPOINT.CLIENT.QUERIES,
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.queries() });
    },
  });
};

export const useUpdateClientQuery = (queryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateClientQueryPayload) => {
      return httpClient.patch<ClientQueryDetail>(
        ENDPOINT.CLIENT.QUERY_DETAIL(queryId),
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.queryDetail(queryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.client.queries() });
    },
  });
};

export const useAddClientQueryReply = (queryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddClientQueryReplyPayload) => {
      return httpClient.post<ClientQueryDetail>(
        ENDPOINT.CLIENT.QUERY_REPLIES(queryId),
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.queryDetail(queryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.client.queries() });
    },
  });
};

export const useCloseClientQuery = (queryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return httpClient.patch<ClientQueryDetail>(ENDPOINT.CLIENT.QUERY_CLOSE(queryId), {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.queryDetail(queryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.client.queries() });
    },
  });
};

export const useReopenClientQuery = (queryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return httpClient.patch<ClientQueryDetail>(ENDPOINT.CLIENT.QUERY_REOPEN(queryId), {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.queryDetail(queryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.client.queries() });
    },
  });
};

export const useClientSettings = () => {
  return useQuery({
    queryKey: queryKeys.client.settings(),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.CLIENT.SETTINGS);

      return {
        ...response,
        data: normalizeObject<ClientSettings>(response.data, {
          profile: {
            name: "",
            image: null,
            timezone: null,
            language: null,
          },
          notifications: {
            email: true,
            push: false,
            inApp: true,
            digestFrequency: "instant",
          },
          privacy: {
            profileVisibility: "public",
            dataSharing: false,
          },
          account: {
            twoFactorEnabled: false,
            lastPasswordChange: null,
          },
        }),
      } as ApiResponse<ClientSettings>;
    },
    staleTime: 1000 * 60,
    retry: 2,
  });
};

export const useUpdateClientSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateClientSettingsPayload) => {
      return httpClient.patch<ClientSettings>(
        ENDPOINT.CLIENT.SETTINGS,
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.settings() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
};
