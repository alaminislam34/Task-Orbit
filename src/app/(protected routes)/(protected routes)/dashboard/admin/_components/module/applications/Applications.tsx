"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Filter, Inbox } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ApplicationStats from "./_components/ApplicationStats";
import ApplicationTable from "./_components/ApplicationTable";
import ApplicationTableSkeleton from "./_components/ApplicationTableSkeleton";
import StatusBadge from "./_components/StatusBadge";
import ViewApplicationModal from "./_components/ViewApplicationModal";
import type { Application, ApplicationColumn, ApplicationStatus, StatusFilter } from "./types";
import { formatCurrency, formatDeadline, getApplicationStats } from "./utils";

type ApplicationState = {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
};

type ApplicationAction =
  | { type: "load_start" }
  | { type: "load_success"; payload: Application[] }
  | { type: "load_error"; payload: string }
  | {
      type: "update_status";
      payload: { applicationId: string; status: "accepted" | "rejected" };
    };

const initialState: ApplicationState = {
  applications: [],
  isLoading: true,
  error: null,
};

const applicationReducer = (
  state: ApplicationState,
  action: ApplicationAction,
): ApplicationState => {
  switch (action.type) {
    case "load_start":
      return { ...state, isLoading: true, error: null };
    case "load_success":
      return { applications: action.payload, isLoading: false, error: null };
    case "load_error":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "update_status":
      return {
        ...state,
        applications: state.applications.map((application) => {
          if (application.id !== action.payload.applicationId) {
            return application;
          }

          return {
            ...application,
            status: action.payload.status,
            updatedAt: new Date().toISOString(),
          };
        }),
      };
    default:
      return state;
  }
};

const filterOptions: { label: string; value: StatusFilter }[] = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Shortlisted", value: "shortlisted" },
];

const Applications = () => {
  const [state, dispatch] = useReducer(applicationReducer, initialState);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(
    null,
  );

  const loadApplications = useCallback(async () => {
    dispatch({ type: "load_start" });

    try {
      const response = await fetch("/data/applications.json", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load applications");
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid applications data shape");
      }

      dispatch({ type: "load_success", payload: data as Application[] });
    } catch {
      dispatch({
        type: "load_error",
        payload: "Unable to load applications. Please try again.",
      });
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const filteredApplications = useMemo(() => {
    if (statusFilter === "all") {
      return state.applications;
    }

    return state.applications.filter(
      (application) => application.status === statusFilter,
    );
  }, [state.applications, statusFilter]);

  const stats = useMemo(() => getApplicationStats(state.applications), [state.applications]);

  const handleStatusChange = (
    applicationId: string,
    status: "accepted" | "rejected",
  ) => {
    dispatch({ type: "update_status", payload: { applicationId, status } });

    setSelectedApplication((previous) => {
      if (!previous || previous.id !== applicationId) {
        return previous;
      }

      return {
        ...previous,
        status,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const columns: ApplicationColumn[] = useMemo(
    () => [
      {
        id: "applicant",
        header: "Applicant",
        renderCell: (application) => (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={application.applicant.avatar} />
              <AvatarFallback>
                {application.applicant.name
                  .split(" ")
                  .map((item) => item.charAt(0))
                  .slice(0, 2)
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="font-medium">{application.applicant.name}</p>
              <p className="text-xs text-muted-foreground">{application.applicant.email}</p>
            </div>
          </div>
        ),
      },
      {
        id: "job",
        header: "Job Title",
        renderCell: (application) => (
          <p className="max-w-xs truncate font-medium">{application.job.title}</p>
        ),
      },
      {
        id: "budget",
        header: "Budget",
        renderCell: (application) => formatCurrency(application.proposedBudget),
      },
      {
        id: "deadline",
        header: "Deadline",
        renderCell: (application) => formatDeadline(application.proposedDeadline),
      },
      {
        id: "status",
        header: "Status",
        renderCell: (application) => <StatusBadge status={application.status} />,
      },
    ],
    [],
  );

  return (
    <section className="space-y-6 ">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <p className="text-sm text-muted-foreground">
          Track freelancer applications, review details, and make hiring decisions.
        </p>
      </div>

      <ApplicationStats stats={stats} />

      <Card className="gap-0 overflow-hidden">
        <CardHeader className="flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
          <CardDescription>
            Showing {filteredApplications.length} application
            {filteredApplications.length === 1 ? "" : "s"}
          </CardDescription>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <Select
              onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "all")}
              value={statusFilter}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {state.isLoading ? (
            <div className="p-4">
              <ApplicationTableSkeleton />
            </div>
          ) : null}

          {!state.isLoading && state.error ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="text-sm text-muted-foreground">{state.error}</p>
              <Button onClick={() => void loadApplications()} variant="outline">
                Retry
              </Button>
            </div>
          ) : null}

          {!state.isLoading && !state.error && filteredApplications.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-2 p-6 text-center">
              <Inbox className="size-8 text-muted-foreground" />
              <p className="font-medium">No applications found</p>
              <p className="text-sm text-muted-foreground">
                Try changing status filter to view more records.
              </p>
            </div>
          ) : null}

          {!state.isLoading && !state.error && filteredApplications.length > 0 ? (
            <ApplicationTable
              applications={filteredApplications}
              columns={columns}
              onStatusChange={handleStatusChange}
              onView={setSelectedApplication}
            />
          ) : null}
        </CardContent>
      </Card>

      <ViewApplicationModal
        application={selectedApplication}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedApplication(null);
          }
        }}
        open={Boolean(selectedApplication)}
      />
    </section>
  );
};

export default Applications;