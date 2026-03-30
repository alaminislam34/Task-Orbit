import type { ReactNode } from "react";

import type { User } from "../manage-users/types";

export type ManagedRole = "seller" | "client" | "recruiter";
export type RoleFilter = "all" | ManagedRole;

export interface ManagedUsersStats {
  total: number;
  sellers: number;
  clients: number;
  recruiters: number;
}

export interface DataTableColumn<TData> {
  id: string;
  header: ReactNode;
  className?: string;
  cellClassName?: string;
  renderCell: (item: TData) => ReactNode;
}

export type ManagedUser = User;
