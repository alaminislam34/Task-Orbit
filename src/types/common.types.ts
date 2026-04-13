export type USER_STATUS = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BANNED" | "BLOCKED" | "DELETED";

export type USER_PRESENCE_STATUS = "ONLINE" | "OFFLINE" | "AWAY" | "BUSY";

export interface UserRestrictionInfo {
  isRestricted: boolean;
  status: USER_STATUS | null;
  reason?: string | null;
  restrictedUntil?: string | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
  sort?: string;
  sortBy?: string;
}

export interface FilterParams extends SearchParams {
  status?: USER_STATUS;
  filter?: string;
  filterBy?: USER_STATUS[];
}

export interface BaseQueryParams extends FilterParams {
  [key: string]: any;
}
