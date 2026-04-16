"use client";

import Link from "next/link";

import { useJobRecommendations } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import SeekerPageHeader from "@/components/module/seeker/shared/SeekerPageHeader";

export default function RecommendedJobs() {
  const { data, isLoading, isFetching } = useJobRecommendations({ page: 1, limit: 20 });

  const jobs = data?.data || [];

  return (
    <div className="space-y-5">
      <SeekerPageHeader
        title="Recommended Jobs"
        description={`Personalized opportunities based on your profile.${isFetching ? " Updating..." : ""}`}
      />

      {isLoading ? (
        <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">Loading recommendations...</div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-border/70 p-8 text-center text-sm text-muted-foreground">
          No recommendations available right now.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-xl border border-border/70 bg-background p-4">
              <p className="font-medium">{job.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {job.city || "-"}, {job.country || "-"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {job.employmentType.replaceAll("_", " ")} • {job.level.replaceAll("_", " ")}
              </p>
              <div className="mt-3">
                <Link href={`/career/${job.id}`}>
                  <Button size="sm" variant="outline">View Job</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
