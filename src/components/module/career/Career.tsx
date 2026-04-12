"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import HeroSection from "./HeroSection";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Globe,
  ExternalLink,
  Heart,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJobs } from "@/hooks/api/jobs/useJobs";
import { useUser } from "@/hooks/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Job } from "@/types/jobs.types";
import { useStateContext } from "@/providers/StateProvider";
// Using imported Job interface now

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const urlPage = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";

  const { data: userResponse } = useUser();
  const user = userResponse?.data;
  const { setSignInModal, setPendingJobId, pendingJobId } = useStateContext();

  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(search, 400);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // When debounce triggers, push to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    // Only push if the search param actually differs to prevent loop
    if (searchParams.get("search") !== (debouncedSearch || null)) {
       params.set("page", "1");
       router.push(pathname + "?" + params.toString(), { scroll: false });
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  // Hook into our actual API
  const { data: jobsResponse, isLoading } = useJobs({
    page: urlPage,
    limit: 15,
    search: urlSearch,
  });

  const jobs = jobsResponse?.data || [];
  
  // Auto select first job when jobs load
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  const handleApply = (jobId: string) => {
    if (!user) {
      setPendingJobId(jobId);
      setSignInModal(true);
      return;
    }
    // Proceed to apply form / process
    console.log("Applying to job:", jobId);
  };

  useEffect(() => {
    // If we just logged in and have a pendingJobId, trigger the modal automatically
    if (user && pendingJobId) {
       console.log("Auto-opening apply flow for job:", pendingJobId);
       setPendingJobId(null);
       // Here you trigger the Apply Application Modal UI
    }
  }, [user, pendingJobId, setPendingJobId]);

  return (
    <main className="min-h-screen bg-[#f3f2f1] dark:bg-slate-950 pb-10">
      {/* Search Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <HeroSection onSearch={setSearch} />
      </div>

      <div className="max-w-360 w-11/12 mx-auto py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <section className="flex-1 flex gap-6">
            {/* Master List: Job Cards */}
            <div
              className={`w-full ${selectedJob ? "lg:w-5/12" : "w-full"} space-y-4`}
            >
              <div className="flex justify-between items-center px-1">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  {jobs.length} Jobs Found
                </h2>
              </div>

              <div className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-20 text-slate-500">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    Loading Jobs...
                  </div>
                ) : (
                  <>
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className={`cursor-pointer p-6 rounded-lg border-2 transition-all duration-200 shadow-sm ${
                          selectedJob?.id === job.id
                            ? "border-green-600 bg-white dark:bg-slate-900 shadow-green-100 dark:shadow-none"
                            : "border-white dark:border-slate-900 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-800"
                        }`}
                      >
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-green-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-green-600 font-semibold text-sm mt-1">
                          TaskOrbit Recruiting
                        </p>

                        <div className="flex items-center gap-3 text-slate-500 text-sm mt-3">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} /> {job.city}, {job.country}
                          </div>
                          {job.employmentType && (
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                              <Globe size={14} /> {job.employmentType.replace("_", " ")}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight">
                            {job.employmentType?.replace("_", " ") || "Full Time"}
                          </span>
                        </div>
                      </div>
                    ))}

                    {jobs.length === 0 && (
                      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-800">
                        <p className="text-slate-500">
                          No jobs match your search criteria.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedJob && (
                <motion.div
                  key={selectedJob.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="hidden lg:block flex-1 sticky top-20 h-[calc(100vh-150px)] overflow-y-auto bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl custom-scrollbar"
                >
                  <div>
                    <div className="p-6 bg-white border-b sticky top-0">
                      <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                        {selectedJob.title}
                      </h1>
                      <div className="flex items-center gap-3">
                        <span className="text-green-600 text-lg font-bold flex items-center gap-1">
                          TaskOrbit Recruiting
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                          {selectedJob.city}, {selectedJob.country}
                        </span>
                      </div>

                      <div className="mt-8 flex gap-4">
                        <Button
                          onClick={() => handleApply(selectedJob.id)}
                          className="bg-green-600 hover:bg-green-700 text-sm"
                          variant="default"
                          size="lg"
                        >
                          Apply Now
                        </Button>
                        <Button variant={"ghost"} size="lg">
                          <Heart size={25} />
                        </Button>
                        <Button variant={"ghost"} size="lg">
                          <Bookmark size={25} />
                        </Button>
                      </div>
                    </div>

                    <hr className="my-10 border-slate-100 dark:border-slate-800" />

                    <div className="space-y-10 p-6">
                      {/* Job Highlights Grid */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">
                            Salary
                          </p>
                          <p className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                            <DollarSign size={20} className="text-green-600" />
                            {selectedJob.salaryCurrency} {selectedJob.salaryMin} - {selectedJob.salaryMax}
                          </p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">
                            Level
                          </p>
                          <p className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                            <Briefcase size={20} className="text-green-600" />
                            {selectedJob.level || "Entry Level"}
                          </p>
                        </div>
                      </div>

                      {/* Content Sections */}
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                          Job Overview
                        </h4>
                        <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-[17px] prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: selectedJob.description }} />
                      </div>

                      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
                          Technical Skills Required
                        </h4>
                        <div className="flex flex-wrap gap-2">
                           {(["Communication", "Development"]).map((skill) => (
                             <span
                               key={skill}
                               className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-2 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm"
                             >
                               {skill}
                             </span>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </main>
  );
}
