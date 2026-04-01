import { Career } from "@/types/data.types";
import { MapPin, Briefcase, Clock, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JobCard({ job }: { job: Career }) {
  const router = useRouter();
  const isLoggedIn = false; // Replace with your Auth logic (e.g., Clerk, NextAuth)

  const handleApply = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      // Open Apply Modal or Redirect to Apply Page
      alert(`Applying for ${job.title}`);
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-200 dark:border-slate-800 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-blue-600 font-medium">{job.company}</p>
        </div>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {job.postedAt}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 text-sm text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="w-4 h-4" /> {job.type}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" /> {job.salary}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={handleApply}
        className="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-semibold hover:bg-blue-600 dark:hover:bg-blue-50 transition-colors"
      >
        Apply Now
      </button>
    </div>
  );
}
