import { PaginatedMeta } from "./api.types";

export type ChatAccountType = "SELLER" | "CLIENT" | "JOB_SEEKER" | "RECRUITER";

export interface ChatUserSummary {
  id: string;
  name: string;
  email?: string;
  image?: string | null;
  accountType?: ChatAccountType;
  status?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
  seen?: boolean;
}

export interface ChatConversation {
  id: string;
  seller?: ChatUserSummary | null;
  client?: ChatUserSummary | null;
  recruiter?: ChatUserSummary | null;
  jobSeeker?: ChatUserSummary | null;
  participants?: ChatUserSummary[];
  lastMessage?: ChatMessage | null;
  unreadCount?: number;
  updatedAt?: string;
  createdAt?: string;
}

export interface ChatConversationListResponse {
  conversations: ChatConversation[];
  meta?: PaginatedMeta;
}

export interface ChatUsersListResponse {
  users: ChatUserSummary[];
  meta?: PaginatedMeta;
}

export interface ChatMessageListResponse {
  messages: ChatMessage[];
  meta?: PaginatedMeta;
}

export interface CreateConversationPayload {
  participantId: string;
}

export interface SendMessagePayload {
  conversationId: string;
  receiverId: string;
  text: string;
}

export interface MarkSeenPayload {
  conversationId: string;
}

export interface ChatErrorPayload {
  event?: string;
  message: string;
}

export interface JoinConversationPayload {
  conversationId: string;
}

export interface TypingPayload {
  conversationId: string;
  receiverId: string;
}

export interface MessagesSeenPayload {
  conversationId: string;
  seenBy: string;
  updatedCount: number;
}

export interface UserStatusPayload {
  userId: string;
  status: "ONLINE" | "OFFLINE";
}

export interface OnlineUsersPayload {
  userIds: string[];
}
