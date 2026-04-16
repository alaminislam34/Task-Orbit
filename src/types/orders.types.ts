import { BaseQueryParams } from "./common.types";

export type OrderStatus =
  | "PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED"
  | "REFUNDED";

export type PhaseStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface OrderParticipant {
  id?: string;
  name?: string;
  email?: string;
  image?: string | null;
}

export interface OrderMessage {
  id: string;
  orderId: string;
  senderId?: string;
  message: string;
  isRead?: boolean;
  attachmentUrls?: string[];
  createdAt?: string;
}

export interface Deliverable {
  id: string;
  phaseId?: string;
  title: string;
  description?: string;
  fileUrl?: string;
  status?: string;
  submittedAt?: string;
}

export interface OrderRecord {
  id: string;
  title: string;
  description?: string;
  amount?: number;
  currency?: string;
  deliveryDate?: string;
  status: OrderStatus | string;
  notes?: string;
  requirements?: string;
  attachmentUrls?: string[];
  currentPhaseId?: string | null;
  phases?: Phase[];
  deliverables?: Deliverable[];
  client?: {
    id?: string;
    user?: OrderParticipant;
  };
  seller?: {
    id?: string;
    user?: OrderParticipant;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Phase {
  id?: string;
  title: string;
  percentage: number;
  deliveryDays: number;
  status?: PhaseStatus | string;
  description?: string;
  price?: number;
}

export interface CreateOfferPayload {
  clientId: string;
  serviceId: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  deliveryDate: string;
  requirements: string;
  notes?: string;
  attachmentUrls?: string[];
  phases?: Phase[];
}

export interface AcceptOfferPayload {
  extensionIds?: string[];
  extensions?: { extensionId: string; quantity: number }[];
}

export interface OrdersQueryParams extends Omit<BaseQueryParams, "status"> {
  status?: OrderStatus | string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: "createdAt" | "amount" | "deliveryDate" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface UpdateOrderLimitedPayload {
  notes?: string;
  requirements?: string;
  attachmentUrls?: string[];
}

export interface StartOrCompletePhasePayload {
  phaseId: string;
}

export interface SubmitDeliverablePayload {
  phaseId: string;
  title: string;
  description?: string;
  fileUrl?: string;
}

export interface OrderMessagesQueryParams extends Omit<BaseQueryParams, "status"> {}

export interface SendOrderMessagePayload {
  orderId: string;
  message: string;
  attachmentUrls?: string[];
}
