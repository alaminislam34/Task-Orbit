export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  meta?: PaginatedMeta;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}

