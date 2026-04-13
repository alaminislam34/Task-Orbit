"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { normalizeApiResponse } from "@/lib/api/normalizeApiResponse";
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

const normalizeChatMessage = (payload: unknown): ChatMessage => {
  const message = (payload ?? {}) as Partial<ChatMessage> & {
    isSeen?: boolean;
    content?: string;
    clientMessageId?: string;
  };

  const textValue = message.text ?? message.content ?? "";

  return {
    id: message.id ?? "",
    conversationId: message.conversationId ?? "",
    senderId: message.senderId ?? "",
    receiverId: message.receiverId ?? "",
    content: textValue,
    text: textValue,
    createdAt: message.createdAt ?? new Date().toISOString(),
    updatedAt: message.updatedAt,
    seen: message.seen ?? message.isSeen ?? false,
    clientMessageId: message.clientMessageId,
  };
};

const ensureMessageDefaults = (
  message: ChatMessage,
  fallbackConversationId?: string,
): ChatMessage => {
  const conversationId = message.conversationId || fallbackConversationId || "";

  return {
    ...message,
    conversationId,
    receiverId: message.receiverId || "",
  };
};

const normalizeConversationsPayload = (
  payload: unknown,
): ChatConversationListResponse => {
  const mapConversation = (conversation: unknown): ChatConversation => {
    const item = conversation as ChatConversation & {
      lastMessage?: unknown;
    };

    return {
      ...item,
      lastMessage: item.lastMessage
        ? ensureMessageDefaults(normalizeChatMessage(item.lastMessage), item.id)
        : null,
    };
  };

  if (!payload) {
    return { conversations: [] };
  }

  if (Array.isArray(payload)) {
    return {
      conversations: payload.map(mapConversation),
    };
  }

  if (typeof payload === "object") {
    const objectPayload = payload as {
      conversations?: unknown;
      data?: unknown;
      meta?: unknown;
    };

    if (Array.isArray(objectPayload.conversations)) {
      return {
        conversations: objectPayload.conversations.map(mapConversation),
        meta: objectPayload.meta as ChatConversationListResponse["meta"],
      };
    }

    if (Array.isArray(objectPayload.data)) {
      return {
        conversations: objectPayload.data.map(mapConversation),
        meta: objectPayload.meta as ChatConversationListResponse["meta"],
      };
    }
  }

  return { conversations: [] };
};

const normalizeMessagesPayload = (payload: unknown): ChatMessageListResponse => {
  if (!payload) {
    return { messages: [] };
  }

  if (Array.isArray(payload)) {
    return {
      messages: payload.map((message) => normalizeChatMessage(message)),
    };
  }

  if (typeof payload === "object") {
    const objectPayload = payload as {
      messages?: unknown;
      data?: unknown;
      meta?: unknown;
    };

    if (Array.isArray(objectPayload.messages)) {
      return {
        messages: objectPayload.messages.map((message) =>
          normalizeChatMessage(message),
        ),
        meta: objectPayload.meta as ChatMessageListResponse["meta"],
      };
    }

    if (Array.isArray(objectPayload.data)) {
      return {
        messages: objectPayload.data.map((message) => normalizeChatMessage(message)),
        meta: objectPayload.meta as ChatMessageListResponse["meta"],
      };
    }

    if (objectPayload.data && typeof objectPayload.data === "object") {
      const nested = objectPayload.data as {
        messages?: unknown;
        meta?: unknown;
      };

      if (Array.isArray(nested.messages)) {
        return {
          messages: nested.messages.map((message) => normalizeChatMessage(message)),
          meta:
            (nested.meta as ChatMessageListResponse["meta"]) ||
            (objectPayload.meta as ChatMessageListResponse["meta"]),
        };
      }
    }
  }

  return { messages: [] };
};

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
            params: { page: 1, limit: 10 },
            headers: {},
          });

          const normalized = normalizeApiResponse<unknown>(response.data, []);
          const users = normalizeChatUsers(normalized.data);

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
      const response = await httpClient.get<unknown>(ENDPOINT.CHAT.CONVERSATIONS, {
        params: { page, limit },
        headers: {},
      });

      const normalized = normalizeApiResponse<unknown>(response.data, []);

      return {
        ...response,
        data: normalizeConversationsPayload({
          data: normalized.data,
          meta: normalized.meta,
        }),
      } as typeof response & { data: ChatConversationListResponse };
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
      const response = await httpClient.get<unknown>(
        ENDPOINT.CHAT.MESSAGES_BY_CONVERSATION(conversationId as string),
        {
          params: { page, limit },
          headers: {},
        },
      );

      const normalized = normalizeApiResponse<unknown>(response.data, []);

      const normalizedMessages = normalizeMessagesPayload({
        data: normalized.data,
        meta: normalized.meta,
      });

      return {
        ...response,
        data: {
          ...normalizedMessages,
          messages: normalizedMessages.messages.map((message) =>
            ensureMessageDefaults(message, conversationId),
          ),
        },
      } as typeof response & { data: ChatMessageListResponse };
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
      const requestPayload = {
        conversationId: payload.conversationId,
        receiverId: payload.receiverId,
        text: payload.text,
      };

      const response = await httpClient.post<unknown>(
        ENDPOINT.CHAT.MESSAGES,
        requestPayload as unknown as Record<string, unknown>,
      );

      const body = response.data as
        | ChatMessage
        | {
            data?: unknown;
          };

      const normalizedBody = normalizeApiResponse<unknown>(body, body as unknown);
      const normalizedMessage = ensureMessageDefaults(
        normalizeChatMessage(normalizedBody.data),
        payload.conversationId,
      );

      return {
        ...response,
        data: normalizedMessage,
      } as typeof response & { data: ChatMessage };
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
  const { accessToken, sessionToken } = useAuthTokens();
  const socketToken = accessToken || sessionToken;

  useEffect(() => {
    if (!socketToken) {
      chatSocketManager.disconnect();
      return;
    }

    chatSocketManager.connect(socketToken);

    return () => {
      chatSocketManager.disconnect();
    };
  }, [socketToken]);

  useEffect(() => {
    if (!socketToken) {
      return;
    }

    chatSocketManager.updateToken(socketToken);
  }, [socketToken]);

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
        messageIds?: string[];
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
