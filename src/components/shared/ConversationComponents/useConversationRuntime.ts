"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/lib/api-error";
import { useUser } from "@/store/useUserStore";
import { queryKeys } from "@/hooks/api/queryKeys";
import type {
  ChatConversation,
  ChatMessage,
  ChatUserSummary,
  SendMessagePayload,
} from "@/types/chat.types";
import {
  useChatSocket,
  useChatUsers,
  useConversationMessages,
  useConversations,
  useCreateConversation,
  useMarkMessagesSeen,
  useSendMessage,
} from "@/hooks/api";
import {
  dedupeRealtimeCollection,
  mergeRealtimeCollection,
  sortMessagesByCreatedAt,
} from "@/lib/chat/realtime-utils";

type PendingMessage = {
  tempId: string;
  payload: SendMessagePayload;
  createdAt: string;
  status: "pending" | "failed";
};

type UiMessage = {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
  createdAt: string;
  sending?: boolean;
  sent?: boolean;
  seen?: boolean;
  failed?: boolean;
  onRetry?: () => void;
};

type SidebarUserItem = {
  id: string;
  name: string;
  avatarUrl?: string;
  online: boolean;
  lastMsg: string;
  time: string;
  unreadCount: number;
  active: boolean;
  status: string;
};

const normalizeMessageContent = (message: ChatMessage): ChatMessage => {
  const resolvedText = message.text || message.content || "";

  return {
    ...message,
    text: resolvedText,
    content: resolvedText,
  };
};

const normalizeConversationSummary = (
  conversationId: string,
  payload: Partial<ChatConversation> & {
    lastMessage?: ChatMessage | null;
    unreadCount?: number;
    updatedAt?: string;
  },
): ChatConversation => {
  const {
    id: _ignoredId,
    lastMessage,
    unreadCount,
    updatedAt,
    ...conversation
  } = payload;
  const incomingLastMessage = payload.lastMessage
    ? normalizeMessageContent({
        ...payload.lastMessage,
        conversationId,
      })
    : null;

  return {
    id: conversationId,
    ...conversation,
    lastMessage: incomingLastMessage,
    unreadCount,
    updatedAt: updatedAt || incomingLastMessage?.createdAt,
  };
};

const hasRequiredLastMessageFields = (message?: ChatMessage | null) => {
  if (!message) {
    return false;
  }

  return Boolean(
    message.id &&
    message.conversationId &&
    message.senderId &&
    message.createdAt &&
    (message.content || message.text),
  );
};

const mergeConversation = (
  existing: ChatConversation | undefined,
  incoming: ChatConversation,
): ChatConversation => {
  const existingLastMessage = existing?.lastMessage
    ? normalizeMessageContent(existing.lastMessage)
    : null;
  const incomingLastMessage = incoming.lastMessage
    ? normalizeMessageContent(incoming.lastMessage)
    : null;

  const mergedLastMessage = hasRequiredLastMessageFields(incomingLastMessage)
    ? incomingLastMessage
    : existingLastMessage;

  const mergedUpdatedAt =
    incoming.updatedAt ||
    incomingLastMessage?.createdAt ||
    existing?.updatedAt ||
    existingLastMessage?.createdAt ||
    incoming.createdAt ||
    existing?.createdAt ||
    "";

  return {
    id: incoming.id || existing?.id || "",
    seller: incoming.seller ?? existing?.seller,
    client: incoming.client ?? existing?.client,
    recruiter: incoming.recruiter ?? existing?.recruiter,
    jobSeeker: incoming.jobSeeker ?? existing?.jobSeeker,
    participants: incoming.participants ?? existing?.participants ?? [],
    lastMessage: mergedLastMessage,
    unreadCount: Math.max(
      0,
      incoming.unreadCount ?? existing?.unreadCount ?? 0,
    ),
    updatedAt: mergedUpdatedAt,
    createdAt: incoming.createdAt ?? existing?.createdAt,
  };
};

const formatTime = (value?: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getConversationPeer = (
  conversation: ChatConversation,
  currentUserId?: string,
) => {
  const relationAwareConversation = conversation as ChatConversation & {
    sellerId?: string;
    recruiterId?: string;
    clientId?: string;
    jobSeekerId?: string;
  };

  if (currentUserId) {
    if (
      relationAwareConversation.sellerId === currentUserId &&
      conversation.recruiter
    ) {
      return conversation.recruiter;
    }

    if (
      relationAwareConversation.recruiterId === currentUserId &&
      conversation.seller
    ) {
      return conversation.seller;
    }

    if (
      relationAwareConversation.clientId === currentUserId &&
      conversation.seller
    ) {
      return conversation.seller;
    }

    if (
      relationAwareConversation.sellerId === currentUserId &&
      conversation.client
    ) {
      return conversation.client;
    }

    if (
      relationAwareConversation.jobSeekerId === currentUserId &&
      conversation.recruiter
    ) {
      return conversation.recruiter;
    }

    if (
      relationAwareConversation.recruiterId === currentUserId &&
      conversation.jobSeeker
    ) {
      return conversation.jobSeeker;
    }
  }

  const candidates = [
    conversation.seller,
    conversation.client,
    conversation.recruiter,
    conversation.jobSeeker,
    ...(conversation.participants ?? []),
  ].filter(Boolean) as ChatUserSummary[];

  return candidates.find((candidate) => candidate.id !== currentUserId) ?? null;
};

const sortMessagesAsc = (messages: ChatMessage[]) => {
  return sortMessagesByCreatedAt(messages);
};

const toUniqueMessages = (messages: ChatMessage[]) => {
  return sortMessagesAsc(dedupeRealtimeCollection(messages));
};

const isForbiddenError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const payload = error as { statusCode?: number; message?: string };

  if (payload.statusCode === 403) {
    return true;
  }

  return payload.message?.toLowerCase().includes("forbidden") ?? false;
};

export const useConversationRuntime = () => {
  const currentUser = useUser();
  const queryClient = useQueryClient();

  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [conversationsById, setConversationsById] = useState<
    Record<string, ChatConversation>
  >({});

  const [incomingMessages, setIncomingMessages] = useState<ChatMessage[]>([]);
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUserIds, setOnlineUserIds] = useState<Record<string, boolean>>(
    {},
  );
  const [seenByConversationId, setSeenByConversationId] = useState<
    Record<string, boolean>
  >({});
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTimeoutsRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const latestUserIdRef = useRef(currentUser?.id ?? "");
  const latestSelectedConversationIdRef = useRef("");
  const lastSeenMessageKeyRef = useRef<Record<string, string>>({});

  const usersQuery = useChatUsers();
  const conversationsQuery = useConversations(1, 100);
  const createConversationMutation = useCreateConversation();
  const sendMessageMutation = useSendMessage();
  const markSeenMutation = useMarkMessagesSeen();
  const { mutate: markMessagesSeen } = markSeenMutation;

  const {
    socket,
    emitJoinConversation,
    emitLeaveConversation,
    emitMarkSeen,
    emitSendMessage,
    emitTyping,
    emitStopTyping,
    bindChatHandlers,
  } = useChatSocket();

  const messagesQuery = useConversationMessages(selectedConversationId, 1, 100);

  const conversations = useMemo(() => {
    return Object.values(conversationsById).sort((a, b) => {
      const aTime = a.updatedAt || a.lastMessage?.createdAt || "";
      const bTime = b.updatedAt || b.lastMessage?.createdAt || "";
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }, [conversationsById]);

  useEffect(() => {
    latestUserIdRef.current = currentUser?.id ?? "";
  }, [currentUser?.id]);

  useEffect(() => {
    latestSelectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  const conversationByUserId = useMemo(() => {
    const map = new Map<string, ChatConversation>();

    Object.values(conversationsById).forEach((conversation) => {
      const peer = getConversationPeer(conversation, currentUser?.id);

      if (peer?.id) {
        map.set(peer.id, conversation);
      }
    });

    return map;
  }, [conversationsById, currentUser?.id]);

  useEffect(() => {
    const fetchedConversations =
      conversationsQuery.data?.data.conversations ?? [];

    if (!fetchedConversations.length) {
      return;
    }

    setConversationsById((previous) => {
      const next = { ...previous };

      fetchedConversations.forEach((incomingConversation) => {
        if (!incomingConversation?.id) {
          return;
        }

        next[incomingConversation.id] = mergeConversation(
          next[incomingConversation.id],
          incomingConversation,
        );
      });

      return next;
    });
  }, [conversationsQuery.data?.data.conversations]);

  useEffect(() => {
    if (!isSocketConnected) {
      return;
    }

    void conversationsQuery.refetch();

    if (selectedConversationId) {
      void messagesQuery.refetch();
    }
  }, [
    selectedConversationId,
    conversationsQuery,
    messagesQuery,
    isSocketConnected,
  ]);

  useEffect(() => {
    if (!socket?.connected) {
      return;
    }

    setIsSocketConnected(true);
    void conversationsQuery.refetch();

    if (selectedConversationId) {
      void messagesQuery.refetch();
    }
  }, [
    socket?.connected,
    selectedConversationId,
    conversationsQuery.refetch,
    messagesQuery.refetch,
  ]);

  useEffect(() => {
    if (!selectedConversationId) {
      return;
    }

    emitJoinConversation({ conversationId: selectedConversationId });

    return () => {
      emitLeaveConversation({ conversationId: selectedConversationId });
    };
  }, [selectedConversationId, emitJoinConversation, emitLeaveConversation]);

  useEffect(() => {
    const handleWindowFocus = () => {
      if (typeof document !== "undefined" && document.hidden) {
        return;
      }

      void conversationsQuery.refetch();

      if (selectedConversationId) {
        void messagesQuery.refetch();
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleWindowFocus);

    return () => {
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleWindowFocus);
    };
  }, [selectedConversationId, conversationsQuery, messagesQuery]);

  const users = useMemo(() => {
    const map = new Map<string, ChatUserSummary>();

    (usersQuery.data?.data.users ?? []).forEach((user) => {
      if (!user?.id || user.id === currentUser?.id) {
        return;
      }

      map.set(user.id, user);
    });

    conversations.forEach((conversation) => {
      const peer = getConversationPeer(conversation, currentUser?.id);

      if (!peer?.id || peer.id === currentUser?.id) {
        return;
      }

      map.set(peer.id, {
        ...peer,
        name: peer.name || "Unknown user",
      });
    });

    return Array.from(map.values());
  }, [usersQuery.data?.data.users, conversations, currentUser?.id]);

  const activeUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  const filteredUsers = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return users;
    }

    return users.filter((user) => {
      const textToSearch =
        `${user.name || ""} ${user.email || ""}`.toLowerCase();
      return textToSearch.includes(value);
    });
  }, [users, query]);

  const schedulePendingTimeout = useCallback((tempId: string) => {
    if (pendingTimeoutsRef.current[tempId]) {
      clearTimeout(pendingTimeoutsRef.current[tempId]);
    }

    pendingTimeoutsRef.current[tempId] = setTimeout(() => {
      setPendingMessages((previous) =>
        previous.map((item) =>
          item.tempId === tempId ? { ...item, status: "failed" } : item,
        ),
      );
    }, 8000);
  }, []);

  const clearPendingTimeout = useCallback((tempId: string) => {
    const timeout = pendingTimeoutsRef.current[tempId];

    if (!timeout) {
      return;
    }

    clearTimeout(timeout);
    delete pendingTimeoutsRef.current[tempId];
  }, []);

  const removePendingByLocalId = useCallback(
    (tempId: string) => {
      clearPendingTimeout(tempId);
      setPendingMessages((previous) =>
        previous.filter((item) => item.tempId !== tempId),
      );
    },
    [clearPendingTimeout],
  );

  const queuePendingMessage = useCallback(
    (payload: SendMessagePayload, existingTempId?: string) => {
      const tempId =
        existingTempId ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const createdAt = new Date().toISOString();
      const payloadWithClientId: SendMessagePayload = {
        ...payload,
        clientMessageId: tempId,
      };

      setPendingMessages((previous) => {
        if (existingTempId) {
          return previous.map((item) =>
            item.tempId === existingTempId
              ? {
                  ...item,
                  payload: payloadWithClientId,
                  status: "pending",
                  createdAt,
                }
              : item,
          );
        }

        return [
          ...previous,
          {
            tempId,
            payload: payloadWithClientId,
            createdAt,
            status: "pending",
          },
        ];
      });

      schedulePendingTimeout(tempId);
      return tempId;
    },
    [schedulePendingTimeout],
  );

  const updateConversationPreview = useCallback(
    (payload: SendMessagePayload, tempId: string, createdAt: string) => {
      const optimisticMessage: ChatMessage = {
        id: tempId,
        conversationId: payload.conversationId,
        senderId: currentUser?.id ?? payload.receiverId ?? tempId,
        receiverId: payload.receiverId,
        content: payload.text,
        text: payload.text,
        createdAt,
        seen: false,
        clientMessageId: tempId,
      };

      setConversationsById((previous) => {
        const existingConversation = previous[payload.conversationId];

        return {
          ...previous,
          [payload.conversationId]: mergeConversation(existingConversation, {
            ...(existingConversation ?? {
              id: payload.conversationId,
              participants: activeUser ? [activeUser] : [],
              createdAt,
            }),
            id: payload.conversationId,
            lastMessage: optimisticMessage,
            updatedAt: createdAt,
            unreadCount: existingConversation?.unreadCount ?? 0,
          }),
        };
      });

      queryClient.setQueryData(
        queryKeys.chat.conversationList({ page: 1, limit: 100 }),
        (
          previous:
            | {
                data?: { conversations?: ChatConversation[] };
              }
            | undefined,
        ) => {
          if (!previous?.data?.conversations) {
            return previous;
          }

          const nextConversations = previous.data.conversations.map(
            (conversation) =>
              conversation.id === payload.conversationId
                ? mergeConversation(conversation, {
                    ...conversation,
                    id: payload.conversationId,
                    lastMessage: optimisticMessage,
                    updatedAt: createdAt,
                    unreadCount: conversation.unreadCount ?? 0,
                  })
                : conversation,
          );

          const existingIndex = nextConversations.findIndex(
            (conversation) => conversation.id === payload.conversationId,
          );

          if (existingIndex === -1) {
            nextConversations.unshift(
              mergeConversation(undefined, {
                id: payload.conversationId,
                participants: activeUser ? [activeUser] : [],
                lastMessage: optimisticMessage,
                updatedAt: createdAt,
                createdAt,
                unreadCount: 0,
              }),
            );
          }

          return {
            ...previous,
            data: {
              ...previous.data,
              conversations: nextConversations,
            },
          };
        },
      );
    },
    [activeUser, currentUser?.id, queryClient],
  );

  const markLatestPendingFailed = useCallback((conversationId?: string) => {
    setPendingMessages((previous) => {
      const next = [...previous];
      const targetIndex = [...next]
        .reverse()
        .findIndex(
          (item) =>
            item.status === "pending" &&
            (!conversationId || item.payload.conversationId === conversationId),
        );

      if (targetIndex === -1) {
        return previous;
      }

      const index = next.length - 1 - targetIndex;
      next[index] = { ...next[index], status: "failed" };
      return next;
    });
  }, []);

  const handleSend = useCallback(
    async (retryPayload?: SendMessagePayload, retryLocalId?: string) => {
      if (!selectedConversationId || !activeUser?.id) {
        toast.error("Select a user to start chatting.");
        return;
      }

      const payload = retryPayload ?? {
        conversationId: selectedConversationId,
        receiverId: activeUser.id,
        text: text.trim(),
      };

      if (!payload.text.trim()) {
        return;
      }

      const tempId = queuePendingMessage(payload, retryLocalId);
      const createdAt = new Date().toISOString();

      const queuedPayload: SendMessagePayload = {
        ...payload,
        clientMessageId: tempId,
      };

      updateConversationPreview(payload, tempId, createdAt);

      if (!retryPayload) {
        setText("");
      }

      emitStopTyping({
        conversationId: payload.conversationId,
        receiverId: payload.receiverId,
      });

      if (isSocketConnected) {
        emitSendMessage(queuedPayload);
        return;
      }

      try {
        const response = await sendMessageMutation.mutateAsync(queuedPayload);
        removePendingByLocalId(tempId);

        setIncomingMessages((previous) =>
          sortMessagesByCreatedAt(
            dedupeRealtimeCollection(
              mergeRealtimeCollection(previous, response.data),
            ),
          ),
        );
      } catch (error) {
        if (isForbiddenError(error)) {
          setPendingMessages((previous) =>
            previous.map((item) =>
              item.tempId === tempId ? { ...item, status: "failed" } : item,
            ),
          );
          toast.error("Invalid chat permission (403).");
          return;
        }

        setPendingMessages((previous) =>
          previous.map((item) =>
            item.tempId === tempId ? { ...item, status: "failed" } : item,
          ),
        );

        toast.error(getApiErrorMessage(error));
      }
    },
    [
      selectedConversationId,
      activeUser?.id,
      text,
      queuePendingMessage,
      updateConversationPreview,
      emitStopTyping,
      isSocketConnected,
      emitSendMessage,
      sendMessageMutation,
      removePendingByLocalId,
    ],
  );

  const handleRetrySend = useCallback(
    (payload: SendMessagePayload, tempId: string) => {
      void handleSend(payload, tempId);
    },
    [handleSend],
  );

  const handleTextChange = useCallback(
    (value: string) => {
      setText(value);

      if (!selectedConversationId || !activeUser?.id) {
        return;
      }

      if (!value.trim()) {
        emitStopTyping({
          conversationId: selectedConversationId,
          receiverId: activeUser.id,
        });
        return;
      }

      emitTyping({
        conversationId: selectedConversationId,
        receiverId: activeUser.id,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping({
          conversationId: selectedConversationId,
          receiverId: activeUser.id,
        });
      }, 300);
    },
    [selectedConversationId, activeUser?.id, emitStopTyping, emitTyping],
  );

  const handleInputFocus = useCallback(() => {
    if (!selectedConversationId || !activeUser?.id) {
      return;
    }

    emitTyping({
      conversationId: selectedConversationId,
      receiverId: activeUser.id,
    });
  }, [selectedConversationId, activeUser?.id, emitTyping]);

  const handleInputBlur = useCallback(() => {
    if (!selectedConversationId || !activeUser?.id) {
      return;
    }

    emitStopTyping({
      conversationId: selectedConversationId,
      receiverId: activeUser.id,
    });
  }, [selectedConversationId, activeUser?.id, emitStopTyping]);

  const openConversationForUser = useCallback(
    async (user: ChatUserSummary) => {
      if (!user.id) {
        return;
      }

      setSelectedUserId(user.id);
      setIsChatOpen(true);

      const existingConversation = conversationByUserId.get(user.id);

      if (existingConversation) {
        setSelectedConversationId(existingConversation.id);
        return;
      }

      try {
        const response = await createConversationMutation.mutateAsync({
          participantId: user.id,
        });

        if (response.data?.id) {
          setConversationsById((previous) => ({
            ...previous,
            [response.data.id]: mergeConversation(
              previous[response.data.id],
              response.data,
            ),
          }));

          setSelectedConversationId(response.data.id);
        }

        await conversationsQuery.refetch();
      } catch (error) {
        if (isForbiddenError(error)) {
          toast.error("You cannot start this chat (403).");
          return;
        }

        toast.error(getApiErrorMessage(error));
      }
    },
    [conversationByUserId, createConversationMutation, conversationsQuery],
  );

  useEffect(() => {
    if (!selectedConversationId) {
      if (seenTimeoutRef.current) {
        clearTimeout(seenTimeoutRef.current);
        seenTimeoutRef.current = null;
      }

      return;
    }

    const apiMessages = [
      ...(messagesQuery.data?.data.messages ?? []),
    ].reverse();
    const liveMessages = incomingMessages.filter(
      (message) => message.conversationId === selectedConversationId,
    );
    const mergedMessages = toUniqueMessages([...apiMessages, ...liveMessages]);

    const latestUnreadMessage = [...mergedMessages]
      .reverse()
      .find(
        (message) =>
          message.conversationId === selectedConversationId &&
          message.senderId !== currentUser?.id &&
          !message.seen,
      );

    if (!latestUnreadMessage) {
      if (seenTimeoutRef.current) {
        clearTimeout(seenTimeoutRef.current);
        seenTimeoutRef.current = null;
      }

      return;
    }

    const latestUnreadKey =
      latestUnreadMessage.clientMessageId || latestUnreadMessage.id;

    if (
      lastSeenMessageKeyRef.current[selectedConversationId] === latestUnreadKey
    ) {
      return;
    }

    if (seenTimeoutRef.current) {
      clearTimeout(seenTimeoutRef.current);
    }

    seenTimeoutRef.current = setTimeout(() => {
      lastSeenMessageKeyRef.current[selectedConversationId] = latestUnreadKey;
      setSeenByConversationId((previous) => ({
        ...previous,
        [selectedConversationId]: true,
      }));

      setConversationsById((previous) => {
        const existing = previous[selectedConversationId];

        if (!existing || (existing.unreadCount ?? 0) === 0) {
          return previous;
        }

        return {
          ...previous,
          [selectedConversationId]: {
            ...existing,
            unreadCount: 0,
          },
        };
      });

      emitMarkSeen({ conversationId: selectedConversationId });
      markMessagesSeen({ conversationId: selectedConversationId });
      seenTimeoutRef.current = null;
    }, 350);

    return () => {
      if (seenTimeoutRef.current) {
        clearTimeout(seenTimeoutRef.current);
        seenTimeoutRef.current = null;
      }
    };
  }, [
    selectedConversationId,
    currentUser?.id,
    incomingMessages,
    emitMarkSeen,
    markMessagesSeen,
    messagesQuery.data?.data.messages,
    setConversationsById,
  ]);

  useEffect(() => {
    return bindChatHandlers({
      onConnect: () => {
        setIsSocketConnected(true);
        void conversationsQuery.refetch();

        if (latestSelectedConversationIdRef.current) {
          void messagesQuery.refetch();
        }
      },
      onReconnect: () => {
        setIsSocketConnected(true);
        void conversationsQuery.refetch();

        if (latestSelectedConversationIdRef.current) {
          void messagesQuery.refetch();
        }
      },
      onDisconnect: () => {
        setIsSocketConnected(false);
      },
      onConnectError: () => {
        setIsSocketConnected(false);
      },
      onMessage: (message) => {
        const conversationId =
          message.conversationId ||
          latestSelectedConversationIdRef.current ||
          "";

        const normalizedMessage = normalizeMessageContent({
          ...message,
          conversationId,
          content: message.content ?? message.text ?? "",
          text: message.text ?? message.content ?? "",
        });

        if (!normalizedMessage.id || !normalizedMessage.conversationId) {
          return;
        }

        if (!hasRequiredLastMessageFields(normalizedMessage)) {
          return;
        }

        setIncomingMessages((previous) =>
          sortMessagesByCreatedAt(
            dedupeRealtimeCollection(
              mergeRealtimeCollection(previous, normalizedMessage),
            ),
          ),
        );

        setConversationsById((previous) => {
          const existingConversation =
            previous[normalizedMessage.conversationId];
          const isIncomingFromPeer =
            normalizedMessage.senderId !== latestUserIdRef.current;
          const isActiveConversation =
            normalizedMessage.conversationId ===
            latestSelectedConversationIdRef.current;

          const nextUnread =
            isIncomingFromPeer && !isActiveConversation
              ? Math.max(0, (existingConversation?.unreadCount ?? 0) + 1)
              : (existingConversation?.unreadCount ?? 0);

          return {
            ...previous,
            [normalizedMessage.conversationId]: mergeConversation(
              existingConversation,
              {
                ...(existingConversation ?? {
                  id: normalizedMessage.conversationId,
                  participants: [],
                }),
                id: normalizedMessage.conversationId,
                lastMessage: normalizedMessage,
                updatedAt: normalizedMessage.createdAt,
                unreadCount: nextUnread,
              },
            ),
          };
        });

        if (
          normalizedMessage.senderId === latestUserIdRef.current &&
          normalizedMessage.clientMessageId
        ) {
          setPendingMessages((previous) => {
            const match = previous.find(
              (item) => item.tempId === normalizedMessage.clientMessageId,
            );

            if (!match) {
              return previous;
            }

            clearPendingTimeout(match.tempId);
            return previous.filter((item) => item.tempId !== match.tempId);
          });
        }
      },
      onConversationSummaryUpdated: (payload) => {
        const conversationId =
          payload.conversationId || payload.conversation?.id || "";

        if (!conversationId) {
          return;
        }

        const summary = normalizeConversationSummary(conversationId, {
          ...(payload.conversation ?? {}),
          lastMessage: payload.lastMessage ?? payload.conversation?.lastMessage,
          unreadCount: payload.unreadCount,
          updatedAt: payload.updatedAt,
        });

        setConversationsById((previous) => {
          const existingConversation = previous[conversationId];
          const mergedConversation = mergeConversation(
            existingConversation,
            summary,
          );

          if (conversationId === latestSelectedConversationIdRef.current) {
            mergedConversation.unreadCount = 0;
          }

          return {
            ...previous,
            [conversationId]: mergedConversation,
          };
        });
      },
      onTyping: (payload) => {
        if (
          payload.conversationId !== latestSelectedConversationIdRef.current
        ) {
          return;
        }

        setTypingUsers((previous) => ({
          ...previous,
          [payload.senderId]: true,
        }));
      },
      onStopTyping: (payload) => {
        if (
          payload.conversationId !== latestSelectedConversationIdRef.current
        ) {
          return;
        }

        setTypingUsers((previous) => ({
          ...previous,
          [payload.senderId]: false,
        }));
      },
      onMessagesSeen: (payload) => {
        if (
          payload.conversationId !== latestSelectedConversationIdRef.current
        ) {
          return;
        }

        if (payload.seenBy === latestUserIdRef.current) {
          return;
        }

        if (payload.messageIds?.length) {
          payload.messageIds.forEach((messageId) => {
            lastSeenMessageKeyRef.current[payload.conversationId] = messageId;
          });

          setIncomingMessages((previous) =>
            previous.map((message) =>
              payload.messageIds?.includes(message.id)
                ? { ...message, seen: true }
                : message,
            ),
          );
        }

        setSeenByConversationId((previous) => ({
          ...previous,
          [payload.conversationId]: true,
        }));
      },
      onUserStatus: (payload) => {
        setOnlineUserIds((previous) => ({
          ...previous,
          [payload.userId]: payload.status === "ONLINE",
        }));
      },
      onOnlineUsers: (payload) => {
        const next: Record<string, boolean> = {};

        payload.userIds.forEach((userId) => {
          next[userId] = true;
        });

        setOnlineUserIds(next);
      },
      onChatError: (payload) => {
        markLatestPendingFailed(latestSelectedConversationIdRef.current);
        toast.error(payload.message || "Chat error");
      },
    });
  }, [
    bindChatHandlers,
    clearPendingTimeout,
    conversationsQuery.refetch,
    messagesQuery.refetch,
    markLatestPendingFailed,
  ]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      Object.values(pendingTimeoutsRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, []);

  const apiMessages = useMemo(() => {
    const messages = messagesQuery.data?.data.messages ?? [];
    return [...messages].reverse();
  }, [messagesQuery.data?.data.messages]);

  const liveMessages = useMemo(() => {
    return incomingMessages.filter(
      (message) => message.conversationId === selectedConversationId,
    );
  }, [incomingMessages, selectedConversationId]);

  const deliveredMessages = useMemo(() => {
    return toUniqueMessages([...apiMessages, ...liveMessages]);
  }, [apiMessages, liveMessages]);

  const pendingForSelectedConversation = useMemo(() => {
    return pendingMessages
      .filter((item) => item.payload.conversationId === selectedConversationId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [pendingMessages, selectedConversationId]);

  const latestPendingByConversation = useMemo(() => {
    const map = new Map<string, PendingMessage>();

    pendingMessages.forEach((item) => {
      const existing = map.get(item.payload.conversationId);

      if (!existing) {
        map.set(item.payload.conversationId, item);
        return;
      }

      if (
        new Date(item.createdAt).getTime() >
        new Date(existing.createdAt).getTime()
      ) {
        map.set(item.payload.conversationId, item);
      }
    });

    return map;
  }, [pendingMessages]);

  const uiMessages = useMemo<UiMessage[]>(() => {
    const delivered = deliveredMessages.map((message) => ({
      id: message.id,
      text: message.text,
      time: formatTime(message.createdAt),
      isOwn: message.senderId === currentUser?.id,
      createdAt: message.createdAt,
      sent: message.senderId === currentUser?.id,
      seen:
        message.senderId === currentUser?.id
          ? Boolean(message.seen) ||
            Boolean(seenByConversationId[message.conversationId])
          : undefined,
    }));

    const pending = pendingForSelectedConversation.map((message) => ({
      id: message.tempId,
      text: message.payload.text,
      time: formatTime(message.createdAt),
      isOwn: true,
      createdAt: message.createdAt,
      sending: message.status === "pending",
      failed: message.status === "failed",
      onRetry:
        message.status === "failed"
          ? () => handleRetrySend(message.payload, message.tempId)
          : undefined,
    }));

    return [...delivered, ...pending].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [
    deliveredMessages,
    currentUser?.id,
    seenByConversationId,
    pendingForSelectedConversation,
    handleRetrySend,
  ]);

  const sidebarUsers = useMemo<SidebarUserItem[]>(() => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const conversationA = conversationByUserId.get(a.id);
      const conversationB = conversationByUserId.get(b.id);
      const pendingA = conversationA
        ? latestPendingByConversation.get(conversationA.id)
        : undefined;
      const pendingB = conversationB
        ? latestPendingByConversation.get(conversationB.id)
        : undefined;

      const timestampA =
        pendingA?.createdAt ||
        conversationA?.updatedAt ||
        conversationA?.lastMessage?.createdAt ||
        "";
      const timestampB =
        pendingB?.createdAt ||
        conversationB?.updatedAt ||
        conversationB?.lastMessage?.createdAt ||
        "";

      return new Date(timestampB).getTime() - new Date(timestampA).getTime();
    });

    return sortedUsers.map((user) => {
      const conversation = conversationByUserId.get(user.id);
      const pendingPreview = conversation
        ? latestPendingByConversation.get(conversation.id)
        : undefined;
      const unreadCount = Math.max(0, conversation?.unreadCount ?? 0);

      const isActive = user.id === selectedUserId;
      const online =
        onlineUserIds[user.id] !== undefined
          ? onlineUserIds[user.id]
          : user.status === "ONLINE";

      return {
        id: user.id,
        name: user.name || "Unknown user",
        avatarUrl: user.image || undefined,
        online,
        lastMsg:
          pendingPreview?.payload.text ||
          conversation?.lastMessage?.text ||
          "No messages yet",
        time:
          formatTime(pendingPreview?.createdAt) ||
          formatTime(conversation?.lastMessage?.createdAt) ||
          "",
        unreadCount,
        active: isActive,
        status: online ? "Active now" : "Offline",
      };
    });
  }, [
    filteredUsers,
    conversationByUserId,
    latestPendingByConversation,
    selectedUserId,
    onlineUserIds,
  ]);
  const activeSidebarUser = useMemo(
    () => sidebarUsers.find((user) => user.id === selectedUserId) ?? null,
    [sidebarUsers, selectedUserId],
  );

  const isPeerTyping = useMemo(() => {
    return Object.values(typingUsers).some(Boolean);
  }, [typingUsers]);

  return {
    text,
    query,
    isChatOpen,
    setIsChatOpen,
    setQuery,
    sidebarUsers,
    activeSidebarUser,
    uiMessages,
    isPeerTyping,
    isUsersLoading: usersQuery.isLoading,
    isMessagesLoading: messagesQuery.isLoading,
    handleSelectUser: openConversationForUser,
    handleTextChange,
    handleInputFocus,
    handleInputBlur,
    handleSend,
  };
};
