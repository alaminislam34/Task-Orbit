"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Search, Users2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { formatDate, getInitials, normalizeUsers } from "../manage-users/utils";
import type { RawUser } from "../manage-users/types";
import DataTable from "./_components/DataTable";
import Pagination from "./_components/Pagination";
import StatusBadge from "./_components/StatusBadge";
import UserModal from "./_components/UserModal";
import UsersStats from "./_components/UsersStats";
import UsersTableSkeleton from "./_components/UsersTableSkeleton";
import type { DataTableColumn, ManagedUser, RoleFilter } from "./types";
import { getManagedUsersStats, isManagedRole } from "./utils";

type UsersState = {
  users: ManagedUser[];
  isLoading: boolean;
  error: string | null;
};

type UsersAction =
  | { type: "load_start" }
  | { type: "load_success"; payload: ManagedUser[] }
  | { type: "load_error"; payload: string }
  | {
      type: "update_status";
      payload: {
        userId: string;
        status: "active" | "inactive";
      };
    };

const initialState: UsersState = {
  users: [],
  isLoading: true,
  error: null,
};

const usersReducer = (state: UsersState, action: UsersAction): UsersState => {
  switch (action.type) {
    case "load_start":
      return { ...state, isLoading: true, error: null };
    case "load_success":
      return {
        users: action.payload,
        isLoading: false,
        error: null,
      };
    case "load_error":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "update_status":
      return {
        ...state,
        users: state.users.map((user) => {
          if (user.id !== action.payload.userId) {
            return user;
          }

          return {
            ...user,
            status: action.payload.status,
          };
        }),
      };
    default:
      return state;
  }
};

const roleFilters: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "seller", label: "Sellers" },
  { value: "client", label: "Clients" },
  { value: "recruiter", label: "Recruiters" },
];

interface UsersPageProps {
  initialRoleFilter?: RoleFilter;
}

const UsersPage = ({ initialRoleFilter = "all" }: UsersPageProps) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(initialRoleFilter);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);

  const loadUsers = useCallback(async () => {
    dispatch({ type: "load_start" });

    try {
      const response = await fetch("/data/users.json", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const payload: unknown = await response.json();

      if (!Array.isArray(payload)) {
        throw new Error("Invalid users payload");
      }

      const normalized = normalizeUsers(payload as RawUser[]);
      const roleUsers = normalized.filter((user) => isManagedRole(user.role));

      dispatch({ type: "load_success", payload: roleUsers });
    } catch {
      dispatch({
        type: "load_error",
        payload: "Unable to load role users right now. Please retry.",
      });
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, search, limit]);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return state.users.filter((user) => {
      const roleMatched = roleFilter === "all" || user.role === roleFilter;
      const searchMatched =
        keyword.length === 0 ||
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword);

      return roleMatched && searchMatched;
    });
  }, [state.users, roleFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const paginatedData = filteredUsers.slice(start, start + limit);
  const showingStart = filteredUsers.length === 0 ? 0 : start + 1;
  const showingEnd = filteredUsers.length === 0 ? 0 : Math.min(start + limit, filteredUsers.length);

  const stats = useMemo(() => getManagedUsersStats(state.users), [state.users]);

  const handleStatusChange = (userId: string, status: "active" | "inactive") => {
    dispatch({ type: "update_status", payload: { userId, status } });

    setSelectedUser((previous) => {
      if (!previous || previous.id !== userId) {
        return previous;
      }

      return {
        ...previous,
        status,
      };
    });
  };

  const columns: DataTableColumn<ManagedUser>[] = useMemo(
    () => [
      {
        id: "profile",
        header: "User",
        renderCell: (user) => (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        renderCell: (user) => <StatusBadge status={user.status} />,
      },
      {
        id: "createdAt",
        header: "Created Date",
        renderCell: (user) => (
          <span className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</span>
        ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Manage Users By Role</h1>
        <p className="text-sm text-muted-foreground">
          Manage sellers, clients, and recruiters with quick moderation actions.
        </p>
      </div>

      <UsersStats stats={stats} />

      <Card className="gap-0 overflow-hidden">
        <CardHeader className="space-y-4 border-b py-4">
          <div className="flex flex-wrap gap-2">
            {roleFilters.map((item) => (
              <Button
                className="rounded-full"
                key={item.value}
                onClick={() => setRoleFilter(item.value)}
                size="sm"
                variant={roleFilter === item.value ? "default" : "outline"}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardDescription>
              Showing {showingStart}-{showingEnd} of {filteredUsers.length} users
            </CardDescription>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <select
                className="h-9 rounded-md border border-input bg-transparent px-2.5 text-sm"
                onChange={(event) => setLimit(Number(event.target.value))}
                value={limit}
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
              </select>
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-8"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name or email"
                  value={search}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {state.isLoading ? <UsersTableSkeleton /> : null}

          {!state.isLoading && state.error ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm text-muted-foreground">{state.error}</p>
              <Button onClick={() => void loadUsers()} variant="outline">
                Retry
              </Button>
            </div>
          ) : null}

          {!state.isLoading && !state.error && filteredUsers.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-2 p-6 text-center">
              <Users2 className="size-8 text-muted-foreground" />
              <p className="font-medium">No role users found</p>
              <p className="text-sm text-muted-foreground">Try a different role or search keyword.</p>
            </div>
          ) : null}

          {!state.isLoading && !state.error && filteredUsers.length > 0 ? (
            <DataTable
              columns={columns}
              data={paginatedData}
              onStatusChange={handleStatusChange}
              onView={setSelectedUser}
            />
          ) : null}
        </CardContent>

        {!state.isLoading && !state.error && filteredUsers.length > 0 ? (
          <CardFooter className="border-t py-4">
            <Pagination onPageChange={setPage} page={currentPage} totalPages={totalPages} />
          </CardFooter>
        ) : null}
      </Card>

      <UserModal
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
          }
        }}
        open={Boolean(selectedUser)}
        user={selectedUser}
      />
    </section>
  );
};

export default UsersPage;
