"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useApplyJob, useSavedJobs, useToggleSaveJob } from "@/hooks/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/jobs.types";
import { ApplyJobModal } from "@/components/module/career/ApplyJobModal";
import { getApiErrorMessage } from "@/lib/api-error";

const PAGE_SIZE = 10;

type ErrorWithRequestId = {
  requestId?: string;
};

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

const SavedJobsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(
    null,
  );

  const filters = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
    }),
    [page, search],
  );

  const { data, isLoading, isError, isFetching, refetch } = useSavedJobs(filters);
  const { mutateAsync: toggleSave, isPending: isToggling } = useToggleSaveJob();
  const { mutateAsync: applyJobMutate, isPending: isApplying } = useApplyJob();

  const savedJobs = data?.data ?? [];
  const meta = data?.meta;

  const handleRemove = async (jobId: string) => {
    try {
      await toggleSave(jobId);
      toast.success("Removed from saved jobs.");
    } catch {
      toast.error("Could not update saved job right now.");
    }
  };

  const handleApplySubmit = async (payload: {
    coverLetter: string;
    resumeFile: File;
  }) => {
    if (!selectedJobForApply) {
      return;
    }

    try {
      const response = await applyJobMutate({
        jobId: selectedJobForApply.id,
        cover_letter: payload.coverLetter,
        resume: payload.resumeFile,
      });

      toast.success(response.message || "Application submitted successfully.");
      setSelectedJobForApply(null);
    } catch (error) {
      const message = getApiErrorMessage(error);
      const requestId = (error as ErrorWithRequestId)?.requestId;

      if (requestId) {
        toast.error(`${message} (Request ID: ${requestId})`);
        return;
      }

      toast.error(message);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Saved Jobs</h1>
        <p className="text-sm text-muted-foreground">Review bookmarked jobs and apply when you are ready.</p>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search saved jobs"
            className="pl-9"
          />
        </div>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm">Could not load saved jobs.</p>
          <Button className="mt-3" size="sm" variant="outline" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">Loading saved jobs...</div>
      ) : savedJobs.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-sm text-muted-foreground">No saved jobs yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedJobs.map((savedItem) => (
            <div key={savedItem.id} className="rounded-lg border bg-background p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-semibold">{savedItem.job.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    {savedItem.job.city || "-"}, {savedItem.job.country || "-"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Saved at: {formatDate(savedItem.createdAt)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/career?search=${encodeURIComponent(savedItem.job.title)}`}>
                    <Button size="sm" variant="outline">
                      View Job
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedJobForApply(savedItem.job)}
                  >
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isToggling}
                    onClick={() => void handleRemove(savedItem.job.id)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta ? (
        <div className="flex items-center justify-between rounded-lg border bg-background p-4 text-sm">
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

      <ApplyJobModal
        open={Boolean(selectedJobForApply)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedJobForApply(null);
          }
        }}
        job={selectedJobForApply}
        isSubmitting={isApplying}
        onSubmit={handleApplySubmit}
      />
    </div>
  );
};

export default SavedJobsPage;
