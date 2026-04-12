import { BaseQueryParams } from "./common.types";

export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  title: string;
  description: string;
  image: string;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

export interface CategoriesQueryParams extends BaseQueryParams {}
