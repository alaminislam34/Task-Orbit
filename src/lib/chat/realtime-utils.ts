import type { ChatConversation, ChatMessage } from "@/types/chat.types";
import type { INotification } from "@/types/notification.types";

type RealtimeIdentity = {
  id: string;
  clientMessageId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const toTime = (value?: string) => {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const hasSharedIdentity = (
  left: RealtimeIdentity,
  right: RealtimeIdentity,
) => {
  const leftKeys = [left.id, left.clientMessageId].filter(Boolean);
  const rightKeys = [right.id, right.clientMessageId].filter(Boolean);

  return leftKeys.some((key) => rightKeys.includes(key));
};

export const mergeRealtimeCollection = <T extends RealtimeIdentity>(
  items: T[],
  next: T,
) => {
  const index = items.findIndex((item) => hasSharedIdentity(item, next));

  if (index === -1) {
    return [...items, next];
  }

  const merged = [...items];
  merged[index] = {
    ...merged[index],
    ...next,
  };

  return merged;
};

export const dedupeRealtimeCollection = <T extends RealtimeIdentity>(
  items: T[],
) => {
  return items.reduce<T[]>((accumulator, item) => {
    return mergeRealtimeCollection(accumulator, item);
  }, []);
};

export const sortMessagesByCreatedAt = (messages: ChatMessage[]) => {
  return [...messages].sort((left, right) => {
    const leftTime = toTime(left.createdAt);
    const rightTime = toTime(right.createdAt);

    if (leftTime !== rightTime) {
      return leftTime - rightTime;
    }

    return left.id.localeCompare(right.id);
  });
};

export const sortNotificationsByCreatedAtDesc = (
  notifications: INotification[],
) => {
  return [...notifications].sort((left, right) => {
    const leftTime = toTime(left.createdAt);
    const rightTime = toTime(right.createdAt);

    if (leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    return right.id.localeCompare(left.id);
  });
};

export const sortConversationsByActivityDesc = (
  conversations: ChatConversation[],
) => {
  return [...conversations].sort((left, right) => {
    const leftTime = toTime(left.updatedAt || left.lastMessage?.createdAt);
    const rightTime = toTime(right.updatedAt || right.lastMessage?.createdAt);

    if (leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    return right.id.localeCompare(left.id);
  });
};
