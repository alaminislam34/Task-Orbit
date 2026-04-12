import { BaseQueryParams } from "./common.types";

export interface ServicePackage {
  tier: "BASIC" | "STANDARD" | "PREMIUM";
  name: string;
  price: number;
  currency: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  currency: string;
  deliveryDays: number;
  revisions: number;
  features: string[];
  tags: string[];
  imageUrls: string[];
  packages: ServicePackage[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  title: string;
  description: string;
  category: string;
  basePrice: number;
  currency: string;
  deliveryDays: number;
  revisions: number;
  features: string[];
  tags: string[];
  imageUrls: string[];
  packages: ServicePackage[];
}

export interface UpdateServicePayload extends Partial<CreateServicePayload> {}

export interface ServicesQueryParams extends BaseQueryParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
}
