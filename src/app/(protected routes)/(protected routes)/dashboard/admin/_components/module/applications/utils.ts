import type {
  Application,
  ApplicationStatsData,
  ApplicationStatus,
} from "./types";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  shortlisted: "Shortlisted",
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDeadline = (days: number): string => {
  return `${days} day${days === 1 ? "" : "s"}`;
};

export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const getApplicationStats = (
  applications: Application[],
): ApplicationStatsData => {
  return applications.reduce<ApplicationStatsData>(
    (accumulator, application) => {
      accumulator.total += 1;

      if (application.status === "pending") {
        accumulator.pending += 1;
      }

      if (application.status === "accepted") {
        accumulator.accepted += 1;
      }

      if (application.status === "rejected") {
        accumulator.rejected += 1;
      }

      return accumulator;
    },
    {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
    },
  );
};
