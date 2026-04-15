"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  useBulkUpdateApplicationStatus,
  useListApplicants,
  useRecruiterJobs,
  useUpdateApplicationStatus,
} from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/types/jobs.types";

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

export const RecruiterApplicantsPage = () => {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "";
  const [selectedJobId, setSelectedJobId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | ApplicationStatus>("ALL");
  const [page, setPage] = useState(1);
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<string[]>([]);

  const recruiterJobsQuery = useRecruiterJobs({ page: 1, limit: 100 });
  const recruiterJobs = recruiterJobsQuery.data?.data ?? [];

  useEffect(() => {
    if (initialJobId) {
      setSelectedJobId(initialJobId);
    }
  }, [initialJobId]);

  const applicantFilters = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
    }),
    [page, search, status],
  );

  const applicantsQuery = useListApplicants(selectedJobId, applicantFilters);
  const applicants = applicantsQuery.data?.data ?? [];
  const meta = applicantsQuery.data?.meta;

  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus();
  const { mutateAsync: bulkUpdateStatus, isPending: isBulkUpdating } = useBulkUpdateApplicationStatus();

  const selectedJobTitle = recruiterJobs.find((job) => job.id === selectedJobId)?.title || selectedJobId;

  const handleSingleAction = async (applicationId: string, nextStatus: ApplicationStatus) => {
    try {
      await updateStatus({ applicationId, status: nextStatus });
      toast.success(`Application moved to ${nextStatus}.`);
      setSelectedApplicationIds((previous) => previous.filter((id) => id !== applicationId));
      void applicantsQuery.refetch();
    } catch {
      toast.error("Could not update application status.");
    }
  };

  const handleBulkAction = async (nextStatus: ApplicationStatus) => {
    if (!selectedApplicationIds.length) {
      toast.error("Select at least one application for bulk update.");
      return;
    }

    try {
      await bulkUpdateStatus({
        applicationIds: selectedApplicationIds,
        status: nextStatus,
      });
      toast.success(`Updated ${selectedApplicationIds.length} applications.`);
      setSelectedApplicationIds([]);
      void applicantsQuery.refetch();
    } catch {
      toast.error("Bulk update failed.");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Job Applications</h1>
        <p className="text-sm text-muted-foreground">Select a job and manage applicant status updates.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-lg border bg-background p-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="mb-1 text-xs text-muted-foreground">Job</p>
          <select
            className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
            value={selectedJobId}
            onChange={(event) => {
              setSelectedJobId(event.target.value);
              setPage(1);
              setSelectedApplicationIds([]);
            }}
          >
            <option value="">Select job</option>
            {recruiterJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          {selectedJobId ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Managing applicants for: {selectedJobTitle}
            </p>
          ) : null}
        </div>

        <div>
          <p className="mb-1 text-xs text-muted-foreground">Search Applicant</p>
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name or cover letter"
          />
        </div>

        <div>
          <p className="mb-1 text-xs text-muted-foreground">Status</p>
          <select
            className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "ALL" | ApplicationStatus);
              setPage(1);
            }}
          >
            {STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-4">
        <p className="text-sm text-muted-foreground">Selected: {selectedApplicationIds.length}</p>
        <Button
          size="sm"
          variant="outline"
          disabled={!selectedApplicationIds.length || isBulkUpdating}
          onClick={() => void handleBulkAction("SHORTLISTED")}
        >
          Bulk Shortlist
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!selectedApplicationIds.length || isBulkUpdating}
          onClick={() => void handleBulkAction("REJECTED")}
        >
          Bulk Reject
        </Button>
      </div>

      {!selectedJobId ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Select a job to view applicants.
        </div>
      ) : applicantsQuery.isLoading ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">Loading applicants...</div>
      ) : applicants.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">No applicants found.</div>
      ) : (
        <div className="space-y-3">
          {applicants.map((applicant) => {
            const selected = selectedApplicationIds.includes(applicant.id);

            return (
              <div key={applicant.id} className="rounded-lg border bg-background p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{applicant.jobSeeker?.user?.name || "Unknown applicant"}</p>
                    <p className="text-xs text-muted-foreground">{applicant.jobSeeker?.user?.email || "No email"}</p>
                    <p className="text-xs text-muted-foreground">Applied: {formatDate(applicant.appliedAt)}</p>
                  </div>
                  <Badge className={STATUS_BADGE_CLASS[applicant.status] ?? "bg-slate-100 text-slate-700"}>
                    {applicant.status}
                  </Badge>
                </div>

                <div className="mt-3 text-sm">
                  <p className="text-muted-foreground">Cover Letter</p>
                  <p>{applicant.cover_letter || "-"}</p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    onClick={() => {
                      setSelectedApplicationIds((previous) =>
                        previous.includes(applicant.id)
                          ? previous.filter((id) => id !== applicant.id)
                          : [...previous, applicant.id],
                      );
                    }}
                  >
                    {selected ? "Selected" : "Select"}
                  </Button>

                  <Button size="sm" variant="outline" disabled={isUpdating} onClick={() => void handleSingleAction(applicant.id, "SHORTLISTED")}>
                    Shortlist
                  </Button>
                  <Button size="sm" variant="outline" disabled={isUpdating} onClick={() => void handleSingleAction(applicant.id, "REJECTED")}>
                    Reject
                  </Button>

                  {applicant.resumeAccessUrl ? (
                    <a href={applicant.resumeAccessUrl} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline">Resume</Button>
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {meta ? (
        <div className="flex items-center justify-between rounded-lg border bg-background p-4 text-sm">
          <p className="text-muted-foreground">Page {meta.page} of {Math.max(1, meta.totalPages)}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => setPage((previous) => Math.max(1, previous - 1))}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => setPage((previous) => previous + 1)}>
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
