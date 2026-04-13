"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import {
  ChatConversation,
  ChatConversationListResponse,
  ChatErrorPayload,
  ChatMessage,
  ChatMessageListResponse,
  ChatUserSummary,
  ChatUsersListResponse,
  CreateConversationPayload,
  JoinConversationPayload,
  MarkSeenPayload,
  SendMessagePayload,
  TypingPayload,
} from "@/types/chat.types";
import { useAuthTokens } from "@/store/useUserStore";
import { chatSocketManager } from "@/lib/chat/socketManager";

const DEFAULT_LIMIT = 20;
const CHAT_USERS_ENDPOINT_CANDIDATES = [ENDPOINT.USER.LIST, "/user"];

const normalizeChatUsers = (payload: unknown): ChatUserSummary[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as ChatUserSummary[];
  }

  if (typeof payload === "object") {
    const objectPayload = payload as {
      users?: unknown;
      data?: unknown;
    };

    if (Array.isArray(objectPayload.users)) {
      return objectPayload.users as ChatUserSummary[];
    }

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as ChatUserSummary[];
    }
  }

  return [];
};

export const useChatUsers = () => {
  return useQuery({
    queryKey: queryKeys.chat.users(),
    queryFn: async () => {
      let lastError: unknown = null;

      for (const endpoint of CHAT_USERS_ENDPOINT_CANDIDATES) {
        try {
          const response = await httpClient.get<unknown>(endpoint, {
            params: { page: 1, limit: 500 },
            headers: {},
          });

          const users = normalizeChatUsers(response.data);

          return {
            ...response,
            data: {
              users,
            },
          } as typeof response & { data: ChatUsersListResponse };
        } catch (error) {
          lastError = error;
        }
      }

      throw lastError;
    },
    staleTime: 1000 * 60,
  });
};

export const useConversations = (page = 1, limit = DEFAULT_LIMIT) => {
  return useQuery({
    queryKey: queryKeys.chat.conversationList({ page, limit }),
    queryFn: async () => {
      const response = await httpClient.get<ChatConversationListResponse>(
        ENDPOINT.CHAT.CONVERSATIONS,
        {
          params: { page, limit },
          headers: {},
        },
      );
      return response;
    },
    staleTime: 1000 * 60,
  });
};

export const useConversationMessages = (
  conversationId?: string,
  page = 1,
  limit = DEFAULT_LIMIT,
) => {
  return useQuery({
    queryKey: queryKeys.chat.messageList(conversationId || "", { page, limit }),
    queryFn: async () => {
      const response = await httpClient.get<ChatMessageListResponse>(
        ENDPOINT.CHAT.MESSAGES_BY_CONVERSATION(conversationId as string),
        {
          params: { page, limit },
          headers: {},
        },
      );
      return response;
    },
    enabled: Boolean(conversationId),
    staleTime: 1000 * 15,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateConversationPayload) => {
      const response = await httpClient.post<ChatConversation>(
        ENDPOINT.CHAT.CONVERSATIONS,
        payload as unknown as Record<string, unknown>,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const response = await httpClient.post<ChatMessage>(
        ENDPOINT.CHAT.MESSAGES,
        payload as unknown as Record<string, unknown>,
      );
      return response;
    },
    onSuccess: (response, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.messageList(payload.conversationId, {
          page: 1,
          limit: DEFAULT_LIMIT,
        }),
      });
      queryClient.setQueryData(
        queryKeys.chat.messageList(payload.conversationId, {
          page: 1,
          limit: DEFAULT_LIMIT,
        }),
        (
          previous:
            | {
                data?: ChatMessageListResponse;
              }
            | undefined,
        ) => {
          if (!previous?.data) {
            return previous;
          }

          return {
            ...previous,
            data: {
              ...previous.data,
              messages: [response.data, ...previous.data.messages],
            },
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      });
    },
  });
};

export const useMarkMessagesSeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MarkSeenPayload) => {
      const response = await httpClient.post<{ updatedCount: number }>(
        ENDPOINT.CHAT.MARK_SEEN,
        payload as unknown as Record<string, unknown>,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      });
    },
  });
};

export const useChatSocket = () => {
  const { accessToken } = useAuthTokens();

  useEffect(() => {
    if (!accessToken) {
      chatSocketManager.disconnect();
      return;
    }

    chatSocketManager.connect(accessToken);

    return () => {
      chatSocketManager.disconnect();
    };
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    chatSocketManager.updateToken(accessToken);
  }, [accessToken]);

  const emitJoinConversation = useCallback(
    (payload: JoinConversationPayload) => {
      chatSocketManager.getSocket()?.emit("join_conversation", payload);
    },
    [],
  );

  const emitTyping = useCallback((payload: TypingPayload) => {
    chatSocketManager.getSocket()?.emit("typing", payload);
  }, []);

  const emitStopTyping = useCallback((payload: TypingPayload) => {
    chatSocketManager.getSocket()?.emit("stop_typing", payload);
  }, []);

  const emitSendMessage = useCallback((payload: SendMessagePayload) => {
    chatSocketManager.getSocket()?.emit("send_message", payload);
  }, []);

  const emitMarkSeen = useCallback((payload: MarkSeenPayload) => {
    chatSocketManager.getSocket()?.emit("mark_as_seen", payload);
  }, []);

  const bindChatHandlers = useCallback(
    (handlers: {
      onMessage?: (message: ChatMessage) => void;
      onTyping?: (payload: TypingPayload & { senderId: string }) => void;
      onStopTyping?: (payload: TypingPayload & { senderId: string }) => void;
      onMessagesSeen?: (payload: {
        conversationId: string;
        seenBy: string;
        updatedCount: number;
      }) => void;
      onUserStatus?: (payload: {
        userId: string;
        status: "ONLINE" | "OFFLINE";
      }) => void;
      onOnlineUsers?: (payload: { userIds: string[] }) => void;
      onChatError?: (payload: ChatErrorPayload) => void;
    }) => chatSocketManager.bindHandlers(handlers),
    [],
  );

  return useMemo(
    () => ({
      socket: chatSocketManager.getSocket(),
      emitJoinConversation,
      emitTyping,
      emitStopTyping,
      emitSendMessage,
      emitMarkSeen,
      bindChatHandlers,
    }),
    [
      emitJoinConversation,
      emitTyping,
      emitStopTyping,
      emitSendMessage,
      emitMarkSeen,
      bindChatHandlers,
    ],
  );
};
