import type { PaginatedMeta } from "./api.types";
import type { BaseQueryParams } from "./common.types";

export type ClientOrderStatus =
  | "PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED"
  | "REFUNDED";

export type ClientSortBy = "createdAt" | "amount" | "deliveryDate" | "updatedAt";

export type ClientSortOrder = "asc" | "desc";

export type ClientQueryStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type ClientQueryPriority = "LOW" | "MEDIUM" | "HIGH";

export type ClientQueryReplySenderRole = "CLIENT" | "ADMIN" | "SUPPORT";

export interface ClientDashboardSummary {
  orderCounts: {
    total: number;
    active: number;
    pending: number;
    completed: number;
    cancelled: number;
    disputed: number;
  };
  spending: {
    totalSpend: number;
    monthSpend: number;
    currency: string;
  };
  pendingActions: {
    pendingApprovals: number;
    pendingDeliverableReviews: number;
  };
  recentOrders: Array<{
    id: string;
    title: string;
    status: ClientOrderStatus;
    amount: number;
    currency: string;
    updatedAt: string;
  }>;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
}

export interface ClientOrdersQueryParams extends Omit<BaseQueryParams, "status"> {
  status?: ClientOrderStatus;
  search?: string;
  sortBy?: ClientSortBy;
  sortOrder?: ClientSortOrder;
  dateFrom?: string;
  dateTo?: string;
}

export interface ClientOrderListItem {
  id: string;
  title: string;
  status: ClientOrderStatus;
  amount: number;
  currency: string;
  deliveryDate?: string | null;
  updatedAt: string;
  seller: {
    id: string;
    name: string;
    image?: string | null;
  };
  progress: {
    totalPhases: number;
    completedPhases: number;
    percentage: number;
  };
  lastMessageAt?: string | null;
}

export interface ClientOrderDetail {
  order: {
    id: string;
    title: string;
    description?: string | null;
    amount: number;
    currency: string;
    status: ClientOrderStatus;
    requirements?: string | null;
    notes?: string | null;
    attachmentUrls?: string[];
    deliveryDate?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  seller: {
    id: string;
    name: string;
    email?: string | null;
    image?: string | null;
  };
  service?: {
    id: string;
    title: string;
    thumbnailUrl?: string | null;
    category?: string | null;
  } | null;
  phases: Array<{
    id: string;
    title: string;
    description?: string | null;
    percentage: number;
    deliveryDays: number;
    status: string;
    startedAt?: string | null;
    completedAt?: string | null;
  }>;
  deliverablesSummary: {
    total: number;
    submitted: number;
    approved: number;
    rejected: number;
    pending: number;
  };
  lastMessageMetadata?: {
    id: string;
    senderId: string;
    message: string;
    createdAt: string;
    isRead: boolean;
  } | null;
  permittedActions: {
    canReviewDeliverables: boolean;
    canSendMessage: boolean;
    canRequestCancellation: boolean;
  };
}

export interface ClientQueriesQueryParams extends Omit<BaseQueryParams, "status"> {
  status?: ClientQueryStatus;
  priority?: ClientQueryPriority;
  category?: string;
  search?: string;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: ClientSortOrder;
}

export interface ClientQueryListItem {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: ClientQueryPriority;
  status: ClientQueryStatus;
  attachmentUrls: string[];
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientQueryReply {
  senderRole: ClientQueryReplySenderRole;
  message: string;
  createdAt: string;
  attachmentUrls: string[];
}

export interface ClientQueryDetail {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: ClientQueryPriority;
  status: ClientQueryStatus;
  attachmentUrls: string[];
  relatedOrderId?: string | null;
  createdAt: string;
  updatedAt: string;
  replies: ClientQueryReply[];
}

export interface CreateClientQueryPayload {
  subject: string;
  description: string;
  category: string;
  priority: ClientQueryPriority;
  attachmentUrls?: string[];
  relatedOrderId?: string;
}

export interface UpdateClientQueryPayload {
  subject?: string;
  category?: string;
  priority?: ClientQueryPriority;
}

export interface AddClientQueryReplyPayload {
  message: string;
  attachmentUrls?: string[];
}

export interface ClientSettings {
  profile: {
    name: string;
    image?: string | null;
    timezone?: string | null;
    language?: string | null;
  };
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    digestFrequency: string;
  };
  privacy: {
    profileVisibility: string;
    dataSharing: boolean;
  };
  account: {
    twoFactorEnabled: boolean;
    lastPasswordChange?: string | null;
  };
}

export interface UpdateClientSettingsPayload {
  profile?: {
    name?: string;
    image?: string;
    timezone?: string;
    language?: string;
  };
  notifications?: {
    email?: boolean;
    push?: boolean;
    inApp?: boolean;
    digestFrequency?: string;
  };
  privacy?: {
    profileVisibility?: string;
    dataSharing?: boolean;
  };
  account?: {
    twoFactorEnabled?: boolean;
  };
}

export type ClientListResponse<TItem> = {
  data: TItem[];
  meta?: PaginatedMeta;
};
