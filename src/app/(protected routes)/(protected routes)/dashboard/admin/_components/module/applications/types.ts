import type { ReactNode } from "react";

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "shortlisted";

export type StatusFilter = "all" | ApplicationStatus;

export interface Application {
  id: string;
  job: {
    id: string;
    title: string;
  };
  applicant: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  coverLetter: string;
  proposedBudget: number;
  proposedDeadline: number;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
}

export interface ApplicationColumn {
  id: string;
  header: ReactNode;
  className?: string;
  cellClassName?: string;
  renderCell: (application: Application) => ReactNode;
}

export interface ApplicationStatsData {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}
