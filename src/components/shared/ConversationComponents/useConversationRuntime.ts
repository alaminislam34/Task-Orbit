"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { useUser } from "@/store/useUserStore";
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

type PendingMessage = {
  localId: string;
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
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

const toUniqueMessages = (messages: ChatMessage[]) => {
  const map = new Map<string, ChatMessage>();

  messages.forEach((message) => {
    map.set(message.id, message);
  });

  return sortMessagesAsc(Array.from(map.values()));
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

  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedConversation, setSelectedConversation] =
    useState<ChatConversation | null>(null);

  const [incomingMessages, setIncomingMessages] = useState<ChatMessage[]>([]);
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUserIds, setOnlineUserIds] = useState<Record<string, boolean>>({});
  const [localUnreadByUserId, setLocalUnreadByUserId] = useState<
    Record<string, number>
  >({});

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const usersQuery = useChatUsers();
  const conversationsQuery = useConversations(1, 100);
  const createConversationMutation = useCreateConversation();
  const sendMessageMutation = useSendMessage();
  const markSeenMutation = useMarkMessagesSeen();
  const { mutate: markMessagesSeen } = markSeenMutation;

  const { socket, emitJoinConversation, emitMarkSeen, emitSendMessage, emitTyping, emitStopTyping, bindChatHandlers } =
    useChatSocket();

  const selectedConversationId = selectedConversation?.id;

  const messagesQuery = useConversationMessages(selectedConversationId, 1, 100);

  const conversations = conversationsQuery.data?.data.conversations ?? [];

  const conversationById = useMemo(() => {
    const map = new Map<string, ChatConversation>();

    conversations.forEach((conversation) => {
      map.set(conversation.id, conversation);
    });

    if (selectedConversation) {
      map.set(selectedConversation.id, selectedConversation);
    }

    return map;
  }, [conversations, selectedConversation]);

  const conversationByUserId = useMemo(() => {
    const map = new Map<string, ChatConversation>();

    conversations.forEach((conversation) => {
      const peer = getConversationPeer(conversation, currentUser?.id);

      if (peer?.id) {
        map.set(peer.id, conversation);
      }
    });

    if (selectedConversation) {
      const peer = getConversationPeer(selectedConversation, currentUser?.id);

      if (peer?.id) {
        map.set(peer.id, selectedConversation);
      }
    }

    return map;
  }, [conversations, currentUser?.id, selectedConversation]);

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
      const textToSearch = `${user.name || ""} ${user.email || ""}`.toLowerCase();
      return textToSearch.includes(value);
    });
  }, [users, query]);

  const schedulePendingTimeout = useCallback((localId: string) => {
    if (pendingTimeoutsRef.current[localId]) {
      clearTimeout(pendingTimeoutsRef.current[localId]);
    }

    pendingTimeoutsRef.current[localId] = setTimeout(() => {
      setPendingMessages((previous) =>
        previous.map((item) =>
          item.localId === localId ? { ...item, status: "failed" } : item,
        ),
      );
    }, 8000);
  }, []);

  const clearPendingTimeout = useCallback((localId: string) => {
    const timeout = pendingTimeoutsRef.current[localId];

    if (!timeout) {
      return;
    }

    clearTimeout(timeout);
    delete pendingTimeoutsRef.current[localId];
  }, []);

  const removePendingByLocalId = useCallback(
    (localId: string) => {
      clearPendingTimeout(localId);
      setPendingMessages((previous) =>
        previous.filter((item) => item.localId !== localId),
      );
    },
    [clearPendingTimeout],
  );

  const queuePendingMessage = useCallback(
    (payload: SendMessagePayload, existingLocalId?: string) => {
      const localId = existingLocalId || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const createdAt = new Date().toISOString();

      setPendingMessages((previous) => {
        if (existingLocalId) {
          return previous.map((item) =>
            item.localId === existingLocalId
              ? { ...item, payload, status: "pending", createdAt }
              : item,
          );
        }

        return [
          ...previous,
          {
            localId,
            payload,
            createdAt,
            status: "pending",
          },
        ];
      });

      schedulePendingTimeout(localId);
      return localId;
    },
    [schedulePendingTimeout],
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

      const localId = queuePendingMessage(payload, retryLocalId);

      if (!retryPayload) {
        setText("");
      }

      emitStopTyping({
        conversationId: payload.conversationId,
        receiverId: payload.receiverId,
      });

      if (socket?.connected) {
        emitSendMessage(payload);
        return;
      }

      try {
        const response = await sendMessageMutation.mutateAsync(payload);
        removePendingByLocalId(localId);

        setIncomingMessages((previous) => {
          if (previous.some((item) => item.id === response.data.id)) {
            return previous;
          }

          return [response.data, ...previous];
        });
      } catch (error) {
        if (isForbiddenError(error)) {
          setPendingMessages((previous) =>
            previous.map((item) =>
              item.localId === localId ? { ...item, status: "failed" } : item,
            ),
          );
          toast.error("Invalid chat permission (403).");
          return;
        }

        setPendingMessages((previous) =>
          previous.map((item) =>
            item.localId === localId ? { ...item, status: "failed" } : item,
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
      emitStopTyping,
      socket?.connected,
      emitSendMessage,
      sendMessageMutation,
      removePendingByLocalId,
    ],
  );

  const handleRetrySend = useCallback(
    (payload: SendMessagePayload, localId: string) => {
      void handleSend(payload, localId);
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

  const openConversationForUser = useCallback(
    async (user: ChatUserSummary) => {
      if (!user.id) {
        return;
      }

      setSelectedUserId(user.id);
      setIsChatOpen(true);

      const existingConversation = conversationByUserId.get(user.id);

      if (existingConversation) {
        setSelectedConversation(existingConversation);
        return;
      }

      try {
        const response = await createConversationMutation.mutateAsync({
          participantId: user.id,
        });

        setSelectedConversation(response.data);
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
      return;
    }

    emitJoinConversation({ conversationId: selectedConversationId });
    emitMarkSeen({ conversationId: selectedConversationId });
    markMessagesSeen({ conversationId: selectedConversationId });

    const peer = getConversationPeer(
      selectedConversation ?? conversationById.get(selectedConversationId) ?? {
        id: selectedConversationId,
      },
      currentUser?.id,
    );

    if (peer?.id) {
      setLocalUnreadByUserId((previous) => {
        if (previous[peer.id] === 0) {
          return previous;
        }

        return {
          ...previous,
          [peer.id]: 0,
        };
      });
    }
  }, [
    selectedConversationId,
    emitJoinConversation,
    emitMarkSeen,
    markMessagesSeen,
    selectedConversation,
    conversationById,
    currentUser?.id,
  ]);

  useEffect(() => {
    return bindChatHandlers({
      onMessage: (message) => {
        setIncomingMessages((previous) => {
          if (previous.some((item) => item.id === message.id)) {
            return previous;
          }

          return [message, ...previous];
        });

        if (message.senderId === currentUser?.id) {
          setPendingMessages((previous) => {
            const match = previous.find(
              (item) =>
                item.payload.conversationId === message.conversationId &&
                item.payload.text.trim() === message.text.trim(),
            );

            if (!match) {
              return previous;
            }

            clearPendingTimeout(match.localId);
            return previous.filter((item) => item.localId !== match.localId);
          });
          return;
        }

        if (message.conversationId === selectedConversationId) {
          return;
        }

        const targetConversation = conversationById.get(message.conversationId);
        const peer = targetConversation
          ? getConversationPeer(targetConversation, currentUser?.id)
          : null;

        if (!peer?.id) {
          return;
        }

        setLocalUnreadByUserId((previous) => ({
          ...previous,
          [peer.id]: (previous[peer.id] ?? 0) + 1,
        }));
      },
      onTyping: (payload) => {
        if (payload.conversationId !== selectedConversationId) {
          return;
        }

        setTypingUsers((previous) => ({
          ...previous,
          [payload.senderId]: true,
        }));
      },
      onStopTyping: (payload) => {
        if (payload.conversationId !== selectedConversationId) {
          return;
        }

        setTypingUsers((previous) => ({
          ...previous,
          [payload.senderId]: false,
        }));
      },
      onMessagesSeen: (payload) => {
        if (payload.conversationId === selectedConversationId) {
          emitMarkSeen({ conversationId: payload.conversationId });
        }
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
        markLatestPendingFailed(selectedConversationId);
        toast.error(payload.message || "Chat error");
      },
    });
  }, [
    bindChatHandlers,
    selectedConversationId,
    currentUser?.id,
    conversationById,
    clearPendingTimeout,
    emitMarkSeen,
    markLatestPendingFailed,
  ]);

  useEffect(() => {
    if (!selectedConversationId) {
      return;
    }

    const latestConversation = conversations.find(
      (conversation) => conversation.id === selectedConversationId,
    );

    if (latestConversation) {
      setSelectedConversation((previous) => {
        if (!previous) {
          return latestConversation;
        }

        if (previous === latestConversation) {
          return previous;
        }

        const prevUpdatedAt = previous.updatedAt ?? "";
        const nextUpdatedAt = latestConversation.updatedAt ?? "";
        const prevLastMessageId = previous.lastMessage?.id ?? "";
        const nextLastMessageId = latestConversation.lastMessage?.id ?? "";
        const prevUnread = previous.unreadCount ?? 0;
        const nextUnread = latestConversation.unreadCount ?? 0;

        if (
          previous.id === latestConversation.id &&
          prevUpdatedAt === nextUpdatedAt &&
          prevLastMessageId === nextLastMessageId &&
          prevUnread === nextUnread
        ) {
          return previous;
        }

        return latestConversation;
      });
    }
  }, [selectedConversationId, conversations]);

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

  const uiMessages = useMemo<UiMessage[]>(() => {
    const delivered = deliveredMessages.map((message) => ({
      id: message.id,
      text: message.text,
      time: formatTime(message.createdAt),
      isOwn: message.senderId === currentUser?.id,
      createdAt: message.createdAt,
    }));

    const pending = pendingForSelectedConversation.map((message) => ({
      id: message.localId,
      text: message.payload.text,
      time: formatTime(message.createdAt),
      isOwn: true,
      createdAt: message.createdAt,
      failed: message.status === "failed",
      onRetry:
        message.status === "failed"
          ? () => handleRetrySend(message.payload, message.localId)
          : undefined,
    }));

    return [...delivered, ...pending].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [
    deliveredMessages,
    currentUser?.id,
    pendingForSelectedConversation,
    handleRetrySend,
  ]);

  const sidebarUsers = useMemo<SidebarUserItem[]>(() => {
    return filteredUsers.map((user) => {
      const conversation = conversationByUserId.get(user.id);
      const unreadFromConversation = conversation?.unreadCount ?? 0;
      const unreadCount =
        localUnreadByUserId[user.id] !== undefined
          ? localUnreadByUserId[user.id]
          : unreadFromConversation;

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
        lastMsg: conversation?.lastMessage?.text || "No messages yet",
        time: formatTime(conversation?.lastMessage?.createdAt) || "",
        unreadCount,
        active: isActive,
        status: online ? "Active now" : "Offline",
      };
    });
  }, [
    filteredUsers,
    conversationByUserId,
    localUnreadByUserId,
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
    handleSend,
  };
};
