"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChatAccountType,
  ChatConversation,
  ChatMessage,
  SendMessagePayload,
} from "@/types/chat.types";
import { useUser } from "@/store/useUserStore";
import { canChatPair } from "@/lib/chat/chat-pair";
import {
  useChatSocket,
  useConversationMessages,
  useConversations,
  useCreateConversation,
  useMarkMessagesSeen,
  useSendMessage,
} from "@/hooks/api";
import { getApiErrorMessage } from "@/lib/api-error";

interface ChatWorkspaceProps {
  title: string;
}

type LocalMessageState = {
  localId: string;
  payload: SendMessagePayload;
  status: "pending" | "failed";
  createdAt: string;
};

const CHAT_OPTIONS: ChatAccountType[] = [
  "SELLER",
  "CLIENT",
  "JOB_SEEKER",
  "RECRUITER",
];

const isChatAccountType = (value?: string): value is ChatAccountType =>
  value === "SELLER" ||
  value === "CLIENT" ||
  value === "JOB_SEEKER" ||
  value === "RECRUITER";

const getConversationId = (conversation: ChatConversation) => conversation.id;

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
  ].filter(Boolean);

  return candidates.find((candidate) => candidate?.id !== currentUserId) ?? null;
};

const toUniqueMessages = (messages: ChatMessage[]) => {
  const map = new Map<string, ChatMessage>();

  messages.forEach((message) => {
    map.set(message.id, message);
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

export const ChatWorkspace = ({ title }: ChatWorkspaceProps) => {
  const currentUser = useUser();
  const currentAccountType = isChatAccountType(currentUser?.accountType)
    ? currentUser.accountType
    : undefined;

  const [conversationPage, setConversationPage] = useState(1);
  const [messagePage, setMessagePage] = useState(1);
  const [selectedConversation, setSelectedConversation] =
    useState<ChatConversation | null>(null);

  const [draftMessage, setDraftMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUserIds, setOnlineUserIds] = useState<Record<string, boolean>>({});
  const [seenConversationIds, setSeenConversationIds] = useState<Record<string, boolean>>({});
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [incomingMessages, setIncomingMessages] = useState<ChatMessage[]>([]);
  const [localMessages, setLocalMessages] = useState<LocalMessageState[]>([]);

  const [participantIdInput, setParticipantIdInput] = useState("");
  const [participantAccountTypeInput, setParticipantAccountTypeInput] =
    useState<ChatAccountType>("CLIENT");

  const conversationsQuery = useConversations(conversationPage, 20);
  const createConversationMutation = useCreateConversation();
  const sendMessageMutation = useSendMessage();
  const markSeenMutation = useMarkMessagesSeen();

  const selectedConversationId = selectedConversation
    ? getConversationId(selectedConversation)
    : undefined;

  const messagesQuery = useConversationMessages(selectedConversationId, messagePage, 20);

  const {
    bindChatHandlers,
    emitJoinConversation,
    emitMarkSeen,
    emitSendMessage,
    emitStopTyping,
    emitTyping,
    socket,
  } = useChatSocket();

  const apiMessages = messagesQuery.data?.data.messages ?? [];
  const mergedMessages = useMemo(() => {
    return toUniqueMessages([...apiMessages, ...incomingMessages]);
  }, [apiMessages, incomingMessages]);

  const latestMessageFromCurrentUser = useMemo(() => {
    return [...mergedMessages]
      .reverse()
      .find((message) => message.senderId === currentUser?.id);
  }, [mergedMessages, currentUser?.id]);

  useEffect(() => {
    if (!selectedConversationId) {
      return;
    }

    emitJoinConversation({ conversationId: selectedConversationId });
  }, [selectedConversationId, emitJoinConversation]);

  useEffect(() => {
    if (!selectedConversationId) {
      return;
    }

    emitMarkSeen({ conversationId: selectedConversationId });
    markSeenMutation.mutate({ conversationId: selectedConversationId });
  }, [selectedConversationId, emitMarkSeen, markSeenMutation]);

  useEffect(() => {
    if (!selectedConversationId) {
      return;
    }

    const handleFocus = () => {
      emitMarkSeen({ conversationId: selectedConversationId });
      markSeenMutation.mutate({ conversationId: selectedConversationId });
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [selectedConversationId, emitMarkSeen, markSeenMutation]);

  useEffect(() => {
    return bindChatHandlers({
      onMessage: (message) => {
        setIncomingMessages((previous) => {
          if (previous.some((item) => item.id === message.id)) {
            return previous;
          }

          return [message, ...previous];
        });

        setLocalMessages((previous) =>
          previous.filter(
            (item) =>
              !(
                item.payload.conversationId === message.conversationId &&
                item.payload.text.trim() === message.text.trim() &&
                message.senderId === currentUser?.id
              ),
          ),
        );
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
        if (payload.conversationId !== selectedConversationId) {
          return;
        }

        setSeenConversationIds((previous) => ({
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
        const nextOnlineState: Record<string, boolean> = {};

        payload.userIds.forEach((userId) => {
          nextOnlineState[userId] = true;
        });

        setOnlineUserIds(nextOnlineState);
      },
      onChatError: (payload) => {
        toast.error(payload.message || "Chat error");
      },
    });
  }, [bindChatHandlers, currentUser?.id, selectedConversationId]);

  const canStartConversation = Boolean(currentUser?.id && currentAccountType);

  const handleCreateConversation = async () => {
    if (!canStartConversation) {
      toast.error("Please log in to start a conversation.");
      return;
    }

    if (!participantIdInput.trim()) {
      toast.error("Participant ID is required.");
      return;
    }

    if (!canChatPair(currentAccountType, participantAccountTypeInput)) {
      toast.error(
        "Invalid chat pair. Allowed: SELLER<->CLIENT and JOB_SEEKER<->RECRUITER.",
      );
      return;
    }

    try {
      const response = await createConversationMutation.mutateAsync({
        participantId: participantIdInput.trim(),
      });

      setSelectedConversation(response.data);
      setParticipantIdInput("");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleSendMessage = async (retryPayload?: SendMessagePayload) => {
    const conversationId = selectedConversationId;
    const peer = selectedConversation
      ? getConversationPeer(selectedConversation, currentUser?.id)
      : null;

    const payload =
      retryPayload ??
      (conversationId && peer
        ? {
            conversationId,
            receiverId: peer.id,
            text: draftMessage.trim(),
          }
        : null);

    if (!payload || !currentAccountType || !peer?.accountType) {
      toast.error("Cannot send message without valid conversation participants.");
      return;
    }

    if (!canChatPair(currentAccountType, peer.accountType)) {
      toast.error(
        "Invalid chat pair. Allowed: SELLER<->CLIENT and JOB_SEEKER<->RECRUITER.",
      );
      return;
    }

    if (!payload.text) {
      return;
    }

    const localId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    if (!retryPayload) {
      setLocalMessages((previous) => [
        {
          localId,
          payload,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        ...previous,
      ]);

      setDraftMessage("");
    }

    if (socket?.connected) {
      emitSendMessage(payload);
    }

    try {
      await sendMessageMutation.mutateAsync(payload);

      setLocalMessages((previous) =>
        previous.filter((item) => item.localId !== localId),
      );
    } catch (error) {
      setLocalMessages((previous) =>
        previous.map((item) =>
          item.localId === localId ? { ...item, status: "failed" } : item,
        ),
      );

      toast.error(getApiErrorMessage(error));
    }
  };

  const handleMessageInputChange = (value: string) => {
    setDraftMessage(value);

    const peer = selectedConversation
      ? getConversationPeer(selectedConversation, currentUser?.id)
      : null;

    if (!selectedConversationId || !peer) {
      return;
    }

    emitTyping({
      conversationId: selectedConversationId,
      receiverId: peer.id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping({
        conversationId: selectedConversationId,
        receiverId: peer.id,
      });
    }, 700);
  };

  return (
    <div className="grid gap-4 p-4 md:grid-cols-[320px_1fr]">
      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold">{title}</h2>

        <div className="space-y-2 rounded-md border p-3">
          <p className="text-sm font-medium">Start new conversation</p>
          <Input
            value={participantIdInput}
            onChange={(event) => setParticipantIdInput(event.target.value)}
            placeholder="Participant user id"
          />
          <select
            value={participantAccountTypeInput}
            onChange={(event) =>
              setParticipantAccountTypeInput(event.target.value as ChatAccountType)
            }
            className="h-9 w-full rounded-md border px-2 text-sm"
          >
            {CHAT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Button
            type="button"
            className="w-full"
            onClick={handleCreateConversation}
            disabled={createConversationMutation.isPending}
          >
            {createConversationMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              "Start Conversation"
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Inbox</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConversationPage((page) => page + 1)}
            >
              More
            </Button>
          </div>

          {conversationsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading conversations...</p>
          ) : null}

          {!conversationsQuery.isLoading &&
          (conversationsQuery.data?.data.conversations?.length ?? 0) === 0 ? (
            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              No conversations yet.
            </p>
          ) : null}

          <div className="space-y-2">
            {(conversationsQuery.data?.data.conversations ?? []).map((conversation) => {
              const peer = getConversationPeer(conversation, currentUser?.id);
              const conversationId = getConversationId(conversation);
              const isSelected = selectedConversationId === conversationId;
              const isPeerOnline = Boolean(peer?.id && onlineUserIds[peer.id]);

              return (
                <button
                  key={conversationId}
                  type="button"
                  className={`w-full rounded-md border p-3 text-left transition ${
                    isSelected ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setMessagePage(1);
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{peer?.name || "Unknown user"}</p>
                    {conversation.unreadCount ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        {conversation.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {conversation.lastMessage?.text || "No messages yet"}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {isPeerOnline ? "Online" : "Offline"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="flex min-h-[70vh] flex-col rounded-lg border bg-card p-4">
        {!selectedConversation ? (
          <div className="flex h-full items-center justify-center rounded-md border border-dashed">
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium">Select a conversation</p>
              <p className="text-xs text-muted-foreground">
                Choose a user from inbox or create a new conversation.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">
                  {getConversationPeer(selectedConversation, currentUser?.id)?.name ||
                    "Conversation"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getConversationPeer(selectedConversation, currentUser?.id)?.accountType ||
                    "Unknown role"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMessagePage((page) => page + 1)}
              >
                Load older
              </Button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto rounded-md border p-3">
              {messagesQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Loading messages...</p>
              ) : null}

              {!messagesQuery.isLoading && mergedMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              ) : null}

              {mergedMessages.map((message) => {
                const isMine = message.senderId === currentUser?.id;

                return (
                  <div
                    key={message.id}
                    className={`max-w-[80%] rounded-md px-3 py-2 text-sm ${
                      isMine
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="mt-1 text-[10px] opacity-80">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                );
              })}

              {localMessages.map((message) => (
                <div
                  key={message.localId}
                  className="ml-auto max-w-[80%] rounded-md bg-primary/70 px-3 py-2 text-sm text-primary-foreground"
                >
                  <p>{message.payload.text}</p>
                  <div className="mt-1 flex items-center justify-between gap-3 text-[10px] opacity-90">
                    <span>
                      {message.status === "pending"
                        ? "Sending..."
                        : "Failed to send"}
                    </span>
                    {message.status === "failed" ? (
                      <button
                        type="button"
                        className="underline"
                        onClick={() => handleSendMessage(message.payload)}
                      >
                        Retry
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 space-y-2">
              {selectedConversationId &&
              Object.values(typingUsers).some(Boolean) ? (
                <p className="text-xs text-muted-foreground">Someone is typing...</p>
              ) : null}

              {latestMessageFromCurrentUser?.seen ||
              (selectedConversationId && seenConversationIds[selectedConversationId]) ? (
                <p className="text-xs text-muted-foreground">Seen</p>
              ) : null}

              <div className="flex items-end gap-2">
                <Textarea
                  value={draftMessage}
                  onChange={(event) => handleMessageInputChange(event.target.value)}
                  placeholder="Type your message..."
                  className="min-h-20"
                />
                <Button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};
