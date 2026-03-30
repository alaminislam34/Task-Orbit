"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Inbox, Search, Users2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import ActionDropdown from "./_components/ActionDropdown";
import DataTable from "./_components/DataTable";
import StatusBadge from "./_components/StatusBadge";
import UserModal from "./_components/UserModal";
import UsersStats from "./_components/UsersStats";
import UsersTableSkeleton from "./_components/UsersTableSkeleton";
import type { DataTableColumn, RawUser, User } from "./types";
import { formatDate, getInitials, getUsersStats, normalizeUsers } from "./utils";

type UsersState = {
  users: User[];
  isLoading: boolean;
  error: string | null;
};

type UsersAction =
  | { type: "load_start" }
  | { type: "load_success"; payload: User[] }
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

const UsersPage = () => {
  const [state, dispatch] = useReducer(usersReducer, initialState);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

      dispatch({
        type: "load_success",
        payload: normalizeUsers(payload as RawUser[]),
      });
    } catch {
      dispatch({
        type: "load_error",
        payload: "Unable to load users right now. Please retry.",
      });
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    return state.users.filter((user) => {
      const isRegisteredUser = user.role === "normal";
      const keyword = search.trim().toLowerCase();
      const searchMatched =
        keyword.length === 0 ||
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword);

      return isRegisteredUser && searchMatched;
    });
  }, [state.users, search]);

  const stats = useMemo(() => getUsersStats(state.users), [state.users]);

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

  const columns: DataTableColumn<User>[] = useMemo(
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
        id: "role",
        header: "Type",
        renderCell: () => (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
            User
          </span>
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Users</h1>
          <p className="text-sm text-muted-foreground">
            Moderate normal registered users. Client, seller, and recruiter views are managed separately.
          </p>
        </div>
      </div>

      <UsersStats stats={stats} />

      <Card className="gap-0 overflow-hidden">
        <CardHeader className="space-y-4 border-b py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardDescription>
              Showing {filteredUsers.length} user{filteredUsers.length === 1 ? "" : "s"}
            </CardDescription>
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
              <p className="font-medium">No users found</p>
              <p className="text-sm text-muted-foreground">Try a different search keyword.</p>
            </div>
          ) : null}

          {!state.isLoading && !state.error && filteredUsers.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredUsers}
              onStatusChange={handleStatusChange}
              onView={setSelectedUser}
            />
          ) : null}
        </CardContent>
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
