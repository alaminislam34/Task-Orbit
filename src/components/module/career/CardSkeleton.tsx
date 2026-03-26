export default function JobSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/2 mb-6"></div>
      <div className="flex gap-2 mb-6">
        <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-20"></div>
        <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-20"></div>
      </div>
      <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded w-full"></div>
    </div>
  );
}
