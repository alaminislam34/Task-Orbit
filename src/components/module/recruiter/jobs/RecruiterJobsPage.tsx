"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  useCreateRecruiterJob,
  useDeleteRecruiterJob,
  useRecruiterJobs,
  useUpdateRecruiterJob,
} from "@/hooks/api";
import { getApiErrorDetails, getApiErrorMessage } from "@/lib/api-error";
import PageHeader from "@/components/shared/PageHeader";
import {
  CreateJobPayload,
  EmploymentType,
  Job,
  JobCategory,
  JobLevel,
  JobStatus,
  SalaryCurrency,
} from "@/types/jobs.types";

const PAGE_SIZE = 10;

const JOB_CATEGORIES: JobCategory[] = [
  "WEB_DEVELOPMENT",
  "MOBILE_DEVELOPMENT",
  "DESIGN",
  "MARKETING",
  "WRITING",
  "FINANCE",
  "BUSINESS",
  "ENGINEERING",
  "OTHER",
];

const JOB_LEVELS: JobLevel[] = [
  "ENTRY_LEVEL",
  "MID_LEVEL",
  "SENIOR_LEVEL",
  "LEAD",
  "MANAGER",
];

const EMPLOYMENT_TYPES: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "FREELANCE",
  "TEMPORARY",
  "INTERNSHIP",
];

const JOB_STATUSES: JobStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "ON_HOLD",
];

const SALARY_CURRENCIES: SalaryCurrency[] = [
  "BDT",
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "CHF",
  "CNY",
  "INR",
];

type JobFormState = {
  title: string;
  description: string;
  category: JobCategory;
  employmentType: EmploymentType;
  level: JobLevel;
  requiredSkills: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: SalaryCurrency;
  country: string;
  city: string;
  isRemote: boolean;
  status: JobStatus;
  closesAt: string;
  metaTitle: string;
  metaDescription: string;
};

const emptyFormState: JobFormState = {
  title: "",
  description: "",
  category: "WEB_DEVELOPMENT",
  employmentType: "FULL_TIME",
  level: "ENTRY_LEVEL",
  requiredSkills: "",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "BDT",
  country: "",
  city: "",
  isRemote: false,
  status: "OPEN",
  closesAt: "",
  metaTitle: "",
  metaDescription: "",
};

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const formatEnumLabel = (value: string) => value.replaceAll("_", " ");

const toNumberOrUndefined = (value: string) => {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeForm = (job?: Job | null): JobFormState => {
  if (!job) {
    return emptyFormState;
  }

  return {
    title: job.title ?? "",
    description: job.description ?? "",
    category: job.category ?? "WEB_DEVELOPMENT",
    employmentType: job.employmentType ?? "FULL_TIME",
    level: job.level ?? "ENTRY_LEVEL",
    requiredSkills: job.requiredSkills?.join(", ") ?? "",
    salaryMin: job.salaryMin?.toString() ?? "",
    salaryMax: job.salaryMax?.toString() ?? "",
    salaryCurrency: job.salaryCurrency ?? "BDT",
    country: job.country ?? "",
    city: job.city ?? "",
    isRemote: Boolean(job.isRemote),
    status: (job.status as JobStatus) ?? "OPEN",
    closesAt: job.closesAt ?? job.deadline ?? "",
    metaTitle: job.metaTitle ?? "",
    metaDescription: job.metaDescription ?? "",
  };
};

export const RecruiterJobsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [form, setForm] = useState<JobFormState>(emptyFormState);

  const filters = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
    }),
    [page, search],
  );

  const jobsQuery = useRecruiterJobs(filters);
  const jobs = jobsQuery.data?.data ?? [];
  const meta = jobsQuery.data?.meta;

  const { mutateAsync: createJob, isPending: isCreating } = useCreateRecruiterJob();
  const { mutateAsync: updateJob, isPending: isUpdating } = useUpdateRecruiterJob(editingJob?.id ?? "");
  const { mutateAsync: deleteJob, isPending: isDeleting } = useDeleteRecruiterJob();

  useEffect(() => {
    if (isFormOpen) {
      setForm(normalizeForm(editingJob));
      return;
    }

    setEditingJob(null);
    setForm(emptyFormState);
  }, [editingJob, isFormOpen]);

  const openCreateForm = () => {
    setEditingJob(null);
    setForm(emptyFormState);
    setIsFormOpen(true);
  };

  const openEditForm = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleDelete = async (job: Job) => {
    const confirmed = window.confirm(`Delete job \"${job.title}\"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteJob(job.id);
      toast.success("Job deleted successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleSubmit = async () => {
    const requiredSkills = form.requiredSkills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!form.title.trim() || !form.description.trim() || !requiredSkills.length) {
      toast.error("Title, description, and at least one skill are required.");
      return;
    }

    const payload: CreateJobPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      employmentType: form.employmentType,
      level: form.level,
      requiredSkills,
      salaryMin: toNumberOrUndefined(form.salaryMin),
      salaryMax: toNumberOrUndefined(form.salaryMax),
      salaryCurrency: form.salaryCurrency,
      country: form.country.trim() || undefined,
      city: form.city.trim() || undefined,
      isRemote: form.isRemote,
      status: form.status,
      closesAt: form.closesAt || undefined,
      metaTitle: form.metaTitle.trim() || undefined,
      metaDescription: form.metaDescription.trim() || undefined,
    };

    try {
      if (editingJob) {
        await updateJob(payload);
        toast.success("Job updated successfully.");
      } else {
        await createJob(payload);
        toast.success("Job created successfully.");
      }

      setIsFormOpen(false);
      setEditingJob(null);
      setForm(emptyFormState);
      void jobsQuery.refetch();
    } catch (error) {
      const errorDetails = getApiErrorDetails(error);
      toast.error(getApiErrorMessage(error), {
        description: [
          errorDetails.message,
          errorDetails.requestId ? `Request ID: ${errorDetails.requestId}` : null,
        ]
          .filter(Boolean)
          .join(" • "),
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="My Jobs"
        description="Create, update, and manage your open roles."
        actions={(
          <Button onClick={openCreateForm}>
            <Plus className="mr-2 size-4" />
            Create Job
          </Button>
        )}
      />

      <div className="rounded-lg border bg-background p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by title or description"
            className="pl-9"
          />
        </div>
      </div>

      {jobsQuery.isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm">Could not load jobs right now.</p>
          <Button className="mt-3" size="sm" variant="outline" onClick={() => void jobsQuery.refetch()}>
            Retry
          </Button>
        </div>
      ) : null}

      {jobsQuery.isLoading ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-sm text-muted-foreground">No recruiter jobs found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg border bg-background p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-semibold">{job.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    {job.city || "-"}, {job.country || "-"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Created: {formatDate(job.createdAt)}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{formatEnumLabel(job.status)}</Badge>
                  <Badge variant="secondary">{job.applicantCount ?? 0} applicants</Badge>
                  <Badge variant="secondary">{job.viewCount ?? 0} views</Badge>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditForm(job)}>
                  <Pencil className="mr-2 size-4" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(job)} disabled={isDeleting}>
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  render={<a href={`/dashboard/recruiter/job-applications?jobId=${job.id}`} />}
                >
                  <Users className="mr-2 size-4" />
                  Applicants
                </Button>
              </div>
            </div>
          ))}
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingJob ? "Edit Job" : "Create Job"}</DialogTitle>
            <DialogDescription>
              Fill in the recruiter job details and publish or update the role.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={form.title} onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))} placeholder="Senior React Developer" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))} placeholder="Describe the role, responsibilities, and expectations." className="min-h-32" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select className="h-10 w-full rounded-md border bg-transparent px-3 text-sm" value={form.category} onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value as JobCategory }))}>
                {JOB_CATEGORIES.map((option) => (
                  <option key={option} value={option}>{formatEnumLabel(option)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Employment Type</label>
              <select className="h-10 w-full rounded-md border bg-transparent px-3 text-sm" value={form.employmentType} onChange={(event) => setForm((previous) => ({ ...previous, employmentType: event.target.value as EmploymentType }))}>
                {EMPLOYMENT_TYPES.map((option) => (
                  <option key={option} value={option}>{formatEnumLabel(option)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <select className="h-10 w-full rounded-md border bg-transparent px-3 text-sm" value={form.level} onChange={(event) => setForm((previous) => ({ ...previous, level: event.target.value as JobLevel }))}>
                {JOB_LEVELS.map((option) => (
                  <option key={option} value={option}>{formatEnumLabel(option)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select className="h-10 w-full rounded-md border bg-transparent px-3 text-sm" value={form.status} onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value as JobStatus }))}>
                {JOB_STATUSES.map((option) => (
                  <option key={option} value={option}>{formatEnumLabel(option)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Required Skills</label>
              <Input value={form.requiredSkills} onChange={(event) => setForm((previous) => ({ ...previous, requiredSkills: event.target.value }))} placeholder="React, TypeScript, Node.js" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Salary Min</label>
              <Input type="number" value={form.salaryMin} onChange={(event) => setForm((previous) => ({ ...previous, salaryMin: event.target.value }))} placeholder="80000" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Salary Max</label>
              <Input type="number" value={form.salaryMax} onChange={(event) => setForm((previous) => ({ ...previous, salaryMax: event.target.value }))} placeholder="150000" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <select className="h-10 w-full rounded-md border bg-transparent px-3 text-sm" value={form.salaryCurrency} onChange={(event) => setForm((previous) => ({ ...previous, salaryCurrency: event.target.value as SalaryCurrency }))}>
                {SALARY_CURRENCIES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Closing Date</label>
              <Input type="datetime-local" value={form.closesAt} onChange={(event) => setForm((previous) => ({ ...previous, closesAt: event.target.value }))} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Input value={form.country} onChange={(event) => setForm((previous) => ({ ...previous, country: event.target.value }))} placeholder="Bangladesh" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input value={form.city} onChange={(event) => setForm((previous) => ({ ...previous, city: event.target.value }))} placeholder="Dhaka" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Meta Title</label>
              <Input value={form.metaTitle} onChange={(event) => setForm((previous) => ({ ...previous, metaTitle: event.target.value }))} placeholder="SEO title for the job post" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Meta Description</label>
              <Textarea value={form.metaDescription} onChange={(event) => setForm((previous) => ({ ...previous, metaDescription: event.target.value }))} placeholder="SEO description for the job post" className="min-h-24" />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => void handleSubmit()} disabled={isCreating || isUpdating}>
              {editingJob ? "Update Job" : "Create Job"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecruiterJobsPage;
