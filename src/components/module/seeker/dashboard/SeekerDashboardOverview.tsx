"use client";

import Link from "next/link";
import { Bookmark, Briefcase, Clock3, MessageSquareText } from "lucide-react";

import {
  useJobRecommendations,
  useListMyApplications,
  useRecentlyViewed,
  useSavedJobs,
} from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SeekerPageHeader from "@/components/module/seeker/shared/SeekerPageHeader";

export default function SeekerDashboardOverview() {
  const applicationsQuery = useListMyApplications({ page: 1, limit: 5 });
  const savedJobsQuery = useSavedJobs({ page: 1, limit: 5 });
  const recommendationsQuery = useJobRecommendations({ page: 1, limit: 4 });
  const recentlyViewedQuery = useRecentlyViewed({ page: 1, limit: 4 });

  const stats = [
    {
      title: "Applications",
      value: applicationsQuery.data?.meta?.total ?? applicationsQuery.data?.data?.length ?? 0,
      icon: Briefcase,
      href: "/dashboard/seeker/applications",
    },
    {
      title: "Saved Jobs",
      value: savedJobsQuery.data?.meta?.total ?? savedJobsQuery.data?.data?.length ?? 0,
      icon: Bookmark,
      href: "/dashboard/seeker/saved-jobs",
    },
    {
      title: "Recently Viewed",
      value: recentlyViewedQuery.data?.meta?.total ?? recentlyViewedQuery.data?.data?.length ?? 0,
      icon: Clock3,
      href: "/dashboard/seeker/recently-viewed",
    },
    {
      title: "Recommendations",
      value:
        recommendationsQuery.data?.meta?.total ??
        recommendationsQuery.data?.data?.length ??
        0,
      icon: MessageSquareText,
      href: "/dashboard/seeker/recommendations",
    },
  ];

  return (
    <div className="space-y-5">
      <SeekerPageHeader
        title="Job Seeker Dashboard"
        description="Track your progress and discover new opportunities."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.title}>
            <CardHeader className="pb-2">
              <CardDescription>{item.title}</CardDescription>
              <CardTitle className="text-2xl">{item.value}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <item.icon className="size-5 text-muted-foreground" />
              <Link href={item.href}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Latest Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {applicationsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading applications...</p>
            ) : applicationsQuery.data?.data?.length ? (
              applicationsQuery.data.data.map((item) => (
                <div key={item.id} className="rounded-xl border border-border/70 p-3">
                  <p className="font-medium">{item.job?.title || "Untitled job"}</p>
                  <p className="text-xs text-muted-foreground">Status: {item.status}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No applications yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recommended Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendationsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading recommendations...</p>
            ) : recommendationsQuery.data?.data?.length ? (
              recommendationsQuery.data.data.map((job) => (
                <div key={job.id} className="rounded-xl border border-border/70 p-3">
                  <p className="font-medium">{job.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.city || "-"}, {job.country || "-"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recommendations right now.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
