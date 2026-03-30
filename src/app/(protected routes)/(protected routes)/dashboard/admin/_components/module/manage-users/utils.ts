import type { RawUser, User, UserRole, UsersStatsData } from "./types";

const allowedRoles: UserRole[] = ["client", "seller", "recruiter", "admin", "normal"];

export const toTitleCase = (value: string): string => {
  if (!value) {
    return "";
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
};

export const formatDate = (isoDate: string): string => {
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

export const getInitials = (fullName: string): string => {
  if (!fullName) {
    return "NA";
  }

  const initials = fullName
    .split(" ")
    .map((item) => item.trim().charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return initials || "NA";
};

const normalizeRole = (value: string | undefined): UserRole => {
  const normalized = value?.toLowerCase() ?? "normal";

  if (allowedRoles.includes(normalized as UserRole)) {
    return normalized as UserRole;
  }

  return "normal";
};

const normalizeStatus = (value: string | undefined): User["status"] => {
  const normalized = value?.toLowerCase() ?? "offline";

  if (normalized === "online" || normalized === "busy" || normalized === "active") {
    return "active";
  }

  return "inactive";
};

export const normalizeUsers = (payload: RawUser[]): User[] => {
  return payload.map((item) => {
    const createdAt = item.createdAt ?? item.crmData?.lastActive ?? new Date().toISOString();

    return {
      id: item.id,
      name: item.base?.name ?? "Unknown User",
      email: item.base?.email ?? "N/A",
      avatar: item.base?.avatar ?? "",
      role: normalizeRole(item.role),
      status: normalizeStatus(item.base?.status),
      createdAt,
      sourceStatus: item.base?.status,
    };
  });
};

export const getUsersStats = (users: User[]): UsersStatsData => {
  return users.reduce<UsersStatsData>(
    (accumulator, user) => {
      accumulator.total += 1;

      if (user.status === "active") {
        accumulator.active += 1;
      }

      if (user.status === "inactive") {
        accumulator.inactive += 1;
      }

      return accumulator;
    },
    {
      total: 0,
      active: 0,
      inactive: 0,
    },
  );
};
