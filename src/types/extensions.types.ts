export interface Extension {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExtensionPayload {
  serviceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

export interface UpdateExtensionPayload extends Partial<Omit<CreateExtensionPayload, "serviceId">> {
  isActive?: boolean;
}
