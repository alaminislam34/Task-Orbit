"use client";

import { CalendarDays, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  useApplicationDetail,
  useWithdrawApplication,
} from "@/hooks/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApplicationDetailDialogProps {
  applicationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWithdrawn?: () => void;
}

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

export default function ApplicationDetailDialog({
  applicationId,
  open,
  onOpenChange,
  onWithdrawn,
}: ApplicationDetailDialogProps) {
  const { data, isLoading, refetch } = useApplicationDetail(applicationId || undefined);
  const withdrawMutation = useWithdrawApplication();

  const application = data?.data;
  const canWithdraw =
    application?.status === "PENDING" || application?.status === "SHORTLISTED";

  const handleWithdraw = async () => {
    if (!application?.id) {
      return;
    }

    try {
      await withdrawMutation.mutateAsync(application.id);
      toast.success("Application withdrawn successfully.");
      onWithdrawn?.();
      void refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>
            Review recruiter responses and your submitted information.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Loading application...</div>
        ) : !application ? (
          <div className="space-y-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm">Could not load this application.</p>
            <Button size="sm" variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-border/70 p-4">
              <p className="text-xs text-muted-foreground">Job Title</p>
              <p className="font-medium">{application.job?.title || "Untitled job"}</p>
              <p className="mt-2 text-xs text-muted-foreground">Status: {application.status}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border/70 p-4">
                <p className="text-xs text-muted-foreground">Applied At</p>
                <p>{formatDate(application.appliedAt)}</p>
              </div>
              <div className="rounded-xl border border-border/70 p-4">
                <p className="text-xs text-muted-foreground">Interview Date</p>
                <p className="inline-flex items-center gap-1">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  {formatDate(application.interviewDate)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 p-4">
              <p className="text-xs text-muted-foreground">Cover Letter</p>
              <p className="mt-1 whitespace-pre-wrap text-sm">
                {application.cover_letter || "No cover letter provided."}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 p-4">
              <p className="text-xs text-muted-foreground">Recruiter Response</p>
              <p className="mt-1 text-sm">{application.responseMessage || "No response yet."}</p>
              <p className="mt-2 text-xs text-muted-foreground">Notes: {application.interviewNotes || "-"}</p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {application.resumeAccessUrl ? (
                <a href={application.resumeAccessUrl} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 size-4" />
                    Open Resume
                  </Button>
                </a>
              ) : null}

              {canWithdraw ? (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => void handleWithdraw()}
                  disabled={withdrawMutation.isPending}
                >
                  {withdrawMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    "Withdraw Application"
                  )}
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
