import { Career } from "@/types/data.types";
import React from "react";
import JobSkeleton from "./CardSkeleton";
import EmptyState from "./EmptyState";
import JobCard from "./Card";

interface JobListProps {
  jobs: Career[];
  isLoading: boolean;
}

const JobList: React.FC<JobListProps> = ({ jobs, isLoading }) => {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <JobSkeleton key={i} />
        ))}
      </div>
    );
  }

  // 2. Empty State
  if (jobs.length === 0) {
    return <EmptyState onReset={() => {}} />;
  }

  // 3. Success State (The Grid)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}

      {/* Pagination Placeholder */}
      <div className="col-span-full mt-12 flex justify-center">
        <nav className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
            Previous
          </button>
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 rounded-lg bg-green-600 text-white text-sm font-bold">
              1
            </button>
            <button className="w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
              2
            </button>
            <button className="w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
              3
            </button>
          </div>
          <button className="px-4 py-2 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default JobList;
