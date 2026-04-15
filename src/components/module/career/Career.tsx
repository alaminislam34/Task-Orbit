"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Heart,
  Building2,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import HeroSection from "./HeroSection";
import { useApplyJob, useJobs } from "@/hooks/api/jobs/useJobs";
import { useToggleSaveJob, useUser } from "@/hooks/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useStateContext } from "@/providers/StateProvider";
import { Job, JobCategory, JobLevel } from "@/types/jobs.types";
import { ApplyJobModal } from "./ApplyJobModal";
import { getApiErrorDetails, getApiErrorMessage } from "@/lib/api-error";
import { Input } from "@/components/ui/input";
import { useUser as useStoredUser } from "@/store/useUserStore";

type ErrorWithRequestId = {
  requestId?: string;
};

const CATEGORY_OPTIONS: JobCategory[] = [
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

const LEVEL_OPTIONS: JobLevel[] = [
  "ENTRY_LEVEL",
  "MID_LEVEL",
  "SENIOR_LEVEL",
  "LEAD",
  "MANAGER",
];

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const urlPage = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";
  const urlLocation = searchParams.get("location") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlLevel = searchParams.get("level") || "";
  const urlSalaryMin = searchParams.get("salaryMin") || "";
  const urlSalaryMax = searchParams.get("salaryMax") || "";

  const user = useStoredUser();
  const { setSignInModal, setPendingJobId } = useStateContext();
  const { mutateAsync: applyJobMutate, isPending: isApplying } = useApplyJob();
  const { mutateAsync: toggleSaveJobMutate, isPending: isTogglingSave } =
    useToggleSaveJob();
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(
    null,
  );

  const [search, setSearch] = useState(urlSearch);
  const [location, setLocation] = useState(urlLocation);
  const [category, setCategory] = useState(urlCategory);
  const [level, setLevel] = useState(urlLevel);
  const [salaryMin, setSalaryMin] = useState(urlSalaryMin);
  const [salaryMax, setSalaryMax] = useState(urlSalaryMax);
  const debouncedSearch = useDebounce(search, 400);
  const debouncedLocation = useDebounce(location, 400);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");

    if (debouncedLocation) params.set("location", debouncedLocation);
    else params.delete("location");

    if (category) params.set("category", category);
    else params.delete("category");

    if (level) params.set("level", level);
    else params.delete("level");

    if (salaryMin) params.set("salaryMin", salaryMin);
    else params.delete("salaryMin");

    if (salaryMax) params.set("salaryMax", salaryMax);
    else params.delete("salaryMax");

    const changed =
      searchParams.get("search") !== (debouncedSearch || null) ||
      searchParams.get("location") !== (debouncedLocation || null) ||
      searchParams.get("category") !== (category || null) ||
      searchParams.get("level") !== (level || null) ||
      searchParams.get("salaryMin") !== (salaryMin || null) ||
      searchParams.get("salaryMax") !== (salaryMax || null);

    if (changed) {
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [
    debouncedSearch,
    debouncedLocation,
    category,
    level,
    salaryMin,
    salaryMax,
    pathname,
    router,
    searchParams,
  ]);

  const { data: jobsResponse, isLoading } = useJobs({
    page: urlPage,
    limit: 12,
    search: urlSearch,
    location: urlLocation || undefined,
    category: (urlCategory as JobCategory) || undefined,
    level: (urlLevel as JobLevel) || undefined,
    salaryMin: urlSalaryMin ? Number(urlSalaryMin) : undefined,
    salaryMax: urlSalaryMax ? Number(urlSalaryMax) : undefined,
  });

  const jobs = jobsResponse?.data || [];
  const meta = jobsResponse?.meta;

  const changePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleToggleSave = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      setPendingJobId(jobId);
      setSignInModal(true);
      return;
    }

    try {
      const response = await toggleSaveJobMutate(jobId);
      const isSaved = Boolean((response.data as { saved?: boolean })?.saved);
      toast.success(
        isSaved ? "Job saved successfully" : "Job removed from saved list",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const clearAllFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("");
    setLevel("");
    setSalaryMin("");
    setSalaryMax("");
  };

  const handleApply = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setPendingJobId(job.id);
      setSignInModal(true);
      return;
    }

    setSelectedJobForApply(job);
  };

  const handleApplySubmit = async (payload: {
    coverLetter: string;
    resumeFile: File;
  }) => {
    if (!selectedJobForApply) {
      return;
    }

    try {
      if (!selectedJobForApply?.id) {
        toast.error("Please select a job before applying.");
        return;
      }

      const response = await applyJobMutate({
        jobId: selectedJobForApply.id,
        cover_letter: payload.coverLetter,
        resume: payload.resumeFile,
      });

      toast.success(response.message);
      setSelectedJobForApply(null);
    } catch (error) {
      const errorDetails = getApiErrorDetails(error);
      const message = errorDetails.validationErrors.length
        ? errorDetails.validationErrors.some((item) => item.path === "jobId")
          ? "Please choose a job before applying."
          : "Please fix the highlighted application input and try again."
        : getApiErrorMessage(error);

      toast.error(message, {
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-white dark:bg-slate-900 border-b">
        <HeroSection
          onSearch={(query, targetLocation) => {
            setSearch(query);
            setLocation(targetLocation);
          }}
        />
      </div>

      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Explore Opportunities
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isLoading
                ? "Finding the best matches..."
                : `${jobsResponse?.meta?.total || jobs.length} jobs available for you`}
            </p>
          </div>

          <Button variant="outline" onClick={clearAllFilters}>
            Clear Filters
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl border bg-background p-4 md:grid-cols-5">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Category</p>
            <select
              className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">All</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-1 text-xs text-muted-foreground">Level</p>
            <select
              className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              <option value="">All</option>
              {LEVEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-1 text-xs text-muted-foreground">Location</p>
            <Input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Dhaka"
            />
          </div>

          <div>
            <p className="mb-1 text-xs text-muted-foreground">Salary Min</p>
            <Input
              value={salaryMin}
              onChange={(event) => setSalaryMin(event.target.value)}
              placeholder="50000"
            />
          </div>

          <div>
            <p className="mb-1 text-xs text-muted-foreground">Salary Max</p>
            <Input
              value={salaryMax}
              onChange={(event) => setSalaryMax(event.target.value)}
              placeholder="150000"
            />
          </div>
        </div>

        {/* Updated Grid: 1 col on mobile, 2 on md, 4 on lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <JobSkeleton />
          ) : (
            <>
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={(e) => handleApply(job, e)}
                  onToggleSave={(e) => void handleToggleSave(job.id, e)}
                  onViewDetails={() => router.push(`/career/${job.id}`)}
                  isSaving={isTogglingSave}
                />
              ))}

              {jobs.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <Briefcase className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">
                    No jobs match your search criteria.
                  </p>
                  <Button
                    variant="link"
                    onClick={clearAllFilters}
                    className="text-green-600"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {meta ? (
          <div className="mt-6 flex items-center justify-between rounded-xl border bg-background p-4 text-sm">
            <p className="text-muted-foreground">
              Page {meta.page} of {Math.max(1, meta.totalPages)}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page <= 1}
                onClick={() => changePage(Math.max(1, meta.page - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page >= meta.totalPages}
                onClick={() => changePage(meta.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </div>

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
    </main>
  );
}

function JobCard({
  job,
  onApply,
  onToggleSave,
  onViewDetails,
  isSaving,
}: {
  job: Job;
  onApply: (e: React.MouseEvent) => void;
  onToggleSave: (e: React.MouseEvent) => void;
  onViewDetails: () => void;
  isSaving: boolean;
}) {
  const salaryMin = typeof job.salaryMin === "number" ? job.salaryMin : 0;
  const salaryMax = typeof job.salaryMax === "number" ? job.salaryMax : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="group flex flex-col h-full cursor-pointer hover:shadow-lg transition-all border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="p-5 pb-2">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Building2 className="h-3.5 w-3.5 text-green-600" />
                <span className="text-[12px] font-bold text-green-600 uppercase tracking-tight">
                  TaskOrbit
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-green-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0"
              disabled={isSaving}
              onClick={onToggleSave}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-2 grow">
          <div className="space-y-2.5 mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {job.city || "-"}, {job.country || "-"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <DollarSign className="h-3.5 w-3.5 text-green-600 shrink-0" />
              {job.salaryCurrency || "BDT"} {salaryMin.toLocaleString()} -{" "}
              {salaryMax.toLocaleString()}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0 bg-slate-100 dark:bg-slate-800 border-none"
            >
              {job.employmentType?.replace("_", " ") || "Full Time"}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-none"
            >
              {job.level || "Entry"}
            </Badge>
          </div>
        </CardContent>

        <Separator className="bg-slate-100 dark:bg-slate-800" />

        <CardFooter className="p-4 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end items-center">
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8 border-slate-200"
              onClick={onViewDetails}
            >
              Details
            </Button>
            <Button
              onClick={onApply}
              size="sm"
              className="flex-1 text-xs h-8 bg-green-600 hover:bg-green-700 text-white"
            >
              Apply
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function JobSkeleton() {
  return Array(8)
    .fill(0)
    .map((_, i) => (
      <Card
        key={i}
        className="w-full h-70 border-slate-200 dark:border-slate-800"
      >
        <CardHeader className="p-5">
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-5 w-full" />
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-14" />
          </div>
        </CardContent>
      </Card>
    ));
}
