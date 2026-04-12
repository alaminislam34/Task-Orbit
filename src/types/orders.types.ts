import { BaseQueryParams } from "./common.types";

export interface Phase {
  id?: string;
  title: string;
  percentage: number;
  deliveryDays: number;
  status?: string;
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
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}
