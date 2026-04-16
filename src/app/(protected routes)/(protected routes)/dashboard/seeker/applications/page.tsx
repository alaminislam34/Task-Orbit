"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Download, Search } from "lucide-react";

import { useListMyApplications } from "@/hooks/api";
import type { ApplicationStatus } from "@/types/jobs.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApplicationDetailDialog from "@/components/module/seeker/applications/ApplicationDetailDialog";
import SeekerPageHeader from "@/components/module/seeker/shared/SeekerPageHeader";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: Array<{ label: string; value: "ALL" | ApplicationStatus }> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Shortlisted", value: "SHORTLISTED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
];

const STATUS_BADGE_CLASS: Record<ApplicationStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  SHORTLISTED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
  WITHDRAWN: "bg-slate-100 text-slate-700",
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

const JobSeekerApplicationPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | ApplicationStatus>("ALL");
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
    }),
    [page, search, status],
  );

  const { data, isLoading, isError, refetch, isFetching } = useListMyApplications(queryParams);
  const applications = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-5">
      <SeekerPageHeader
        title="My Applications"
        description="Track recruiter responses, interview schedules, and application progress."
      />

      <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by job title"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={status === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setStatus(option.value);
                setPage(1);
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm">Could not load applications right now.</p>
          <Button className="mt-3" size="sm" variant="outline" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="rounded-xl border border-border/70 p-8 text-center">
          <p className="text-sm text-muted-foreground">No applications found for the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="rounded-xl border border-border/70 bg-background p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <h2 className="font-semibold">{application.job?.title ?? "Untitled job"}</h2>
                  <p className="text-xs text-muted-foreground">Application ID: {application.id}</p>
                </div>
                <Badge className={STATUS_BADGE_CLASS[application.status] ?? "bg-slate-100 text-slate-700"}>
                  {application.status}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Applied At</p>
                  <p>{formatDate(application.appliedAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Recruiter Response</p>
                  <p>{application.responseMessage || "No response yet"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Interview Date</p>
                  <p className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5 text-muted-foreground" />
                    {formatDate(application.interviewDate)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Interview Notes</p>
                  <p>{application.interviewNotes || "-"}</p>
                </div>
              </div>

              {application.resumeAccessUrl ? (
                <div className="mt-4">
                  <a href={application.resumeAccessUrl} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 size-4" />
                      Download Resume
                    </Button>
                  </a>
                </div>
              ) : null}

              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedApplicationId(application.id)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta ? (
        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background p-4 text-sm">
          <p className="text-muted-foreground">
            Page {meta.page} of {Math.max(1, meta.totalPages)} {isFetching ? "(updating...)" : ""}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1 || isFetching}
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages || isFetching}
              onClick={() => setPage((previous) => previous + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <ApplicationDetailDialog
        applicationId={selectedApplicationId}
        open={Boolean(selectedApplicationId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApplicationId(null);
          }
        }}
        onWithdrawn={() => void refetch()}
      />
    </div>
  );
};

export default JobSeekerApplicationPage;
