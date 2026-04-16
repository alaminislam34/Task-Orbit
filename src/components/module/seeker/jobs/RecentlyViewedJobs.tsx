"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useDeleteRecentlyViewed, useRecentlyViewed } from "@/hooks/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import SeekerPageHeader from "@/components/module/seeker/shared/SeekerPageHeader";

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

export default function RecentlyViewedJobs() {
  const { data, isLoading, isFetching } = useRecentlyViewed({ page: 1, limit: 20 });
  const deleteMutation = useDeleteRecentlyViewed();

  const items = data?.data || [];

  const handleRemove = async (jobId: string) => {
    try {
      await deleteMutation.mutateAsync(jobId);
      toast.success("Removed from recently viewed.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-5">
      <SeekerPageHeader
        title="Recently Viewed Jobs"
        description={`Continue where you left off.${isFetching ? " Updating..." : ""}`}
      />

      {isLoading ? (
        <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">Loading recently viewed jobs...</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border/70 p-8 text-center text-sm text-muted-foreground">
          No recently viewed jobs yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border/70 bg-background p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{item.job.title}</p>
                  <p className="text-xs text-muted-foreground">Viewed at: {formatDate(item.viewedAt)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/career/${item.jobId}`}>
                    <Button size="sm" variant="outline">Open Job</Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void handleRemove(item.jobId)}
                    disabled={deleteMutation.isPending}
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
    </div>
  );
}
