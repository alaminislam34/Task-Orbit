import { PaginatedMeta } from "./api.types";

export type NotificationType = 
  | "SYSTEM" 
  | "MESSAGE" 
  | "JOB" 
  | "ADMIN" 
  | "ORDER" 
  | "PAYMENT" 
  | "ALERT"
  | "APPLICATION";

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface INotification {
  id: string;
  userId: string;
  receiverId?: string;
  senderId?: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  isRead: boolean;
  actionUrl?: string | null;
  actionLabel?: string | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
  sortBy?: "createdAt" | "priority";
  order?: "asc" | "desc";
}

export interface NotificationListResponse {
  notifications: INotification[];
  meta?: PaginatedMeta;
}

export interface NotificationMarkReadPayload {
  notificationIds: string[];
}

export interface NotificationPreferences {
  userId: string;
  enableEmail: boolean;
  enablePush: boolean;
  enableInApp: boolean;
  muteUntil?: string | null;
  categories?: {
    [key in NotificationType]?: boolean;
  };
}

// Real-time socket events
export interface NotificationSocketPayload {
  notification: INotification;
  timestamp: string;
}

export interface NotificationReadSocketPayload {
  notificationId: string;
  userId: string;
  timestamp: string;
}

export interface UnreadCountPayload {
  unreadCount: number;
  userId: string;
}
