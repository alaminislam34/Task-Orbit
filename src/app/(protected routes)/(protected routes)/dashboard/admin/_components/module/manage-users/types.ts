import type { ReactNode } from "react";

export type UserRole = "client" | "seller" | "recruiter" | "admin" | "normal";
export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  sourceStatus?: string;
}

export interface UsersStatsData {
  total: number;
  active: number;
  inactive: number;
}

export interface DataTableColumn<TData> {
  id: string;
  header: ReactNode;
  className?: string;
  cellClassName?: string;
  renderCell: (item: TData) => ReactNode;
}

export interface RawUser {
  id: string;
  role?: string;
  base?: {
    name?: string;
    email?: string;
    avatar?: string;
    status?: string;
  };
  crmData?: {
    lastActive?: string;
  };
  createdAt?: string;
}
