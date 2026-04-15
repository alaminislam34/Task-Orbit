"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Briefcase, CalendarDays, Globe, MapPin } from "lucide-react";

import { useGetJobDetail } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
};

const CareerJobDetailPage = () => {
  const params = useParams<{ jobId: string }>();
  const jobId = Array.isArray(params?.jobId) ? params.jobId[0] : params?.jobId;

  const { data, isLoading, isError, refetch } = useGetJobDetail(jobId || "");
  const job = data?.data;

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading job details...</div>;
  }

  if (isError || !job) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm">Could not load this job right now.</p>
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
            <Link href="/career">
              <Button size="sm" variant="outline">Back to Career</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{job.recruiter?.agencyName || "TaskOrbit Recruiter"}</p>
        </div>
        <Link href="/career">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-lg border bg-background p-4 md:grid-cols-4">
        <div className="text-sm">
          <p className="text-muted-foreground">Location</p>
          <p className="inline-flex items-center gap-1">
            <MapPin className="size-4" />
            {job.city || "-"}, {job.country || "-"}
          </p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Remote</p>
          <p className="inline-flex items-center gap-1">
            <Globe className="size-4" />
            {job.isRemote ? "Yes" : "No"}
          </p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Employment</p>
          <p className="inline-flex items-center gap-1">
            <Briefcase className="size-4" />
            {job.employmentType.replaceAll("_", " ")}
          </p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Deadline</p>
          <p className="inline-flex items-center gap-1">
            <CalendarDays className="size-4" />
            {formatDate(job.closesAt || job.deadline)}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <h2 className="mb-3 text-lg font-semibold">Job Description</h2>
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">{job.description}</p>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <h2 className="mb-3 text-lg font-semibold">Skills & Requirements</h2>
        <div className="flex flex-wrap gap-2">
          {(job.requiredSkills || []).map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
          {!job.requiredSkills?.length ? <p className="text-sm text-muted-foreground">No skills listed.</p> : null}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Link href="/career">
          <Button variant="outline">More Jobs</Button>
        </Link>
      </div>
    </main>
  );
};

export default CareerJobDetailPage;
