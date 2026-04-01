export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f3f2f1] dark:bg-slate-950">
      {/* 1. Top Search/Hero Area Skeleton */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-10">
        <div className="max-w-360 w-11/12 mx-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-10 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto animate-pulse" />
            <div className="h-16 w-full bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse shadow-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-360 w-11/12 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 2. Left Side: Job Cards List Skeleton */}
          <aside className="w-full lg:w-5/12 space-y-4">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-6" />

            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-transparent shadow-sm space-y-4"
              >
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-1/3 bg-slate-50 dark:bg-slate-800 rounded animate-pulse" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-6 w-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </aside>

          {/* 3. Right Side: Job Detail Pane Skeleton (Desktop Only) */}
          <section className="hidden lg:block flex-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm h-[calc(100vh-140px)] sticky top-10">
            <div className="p-10 space-y-10">
              <div className="space-y-4">
                <div className="h-12 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-6 w-1/3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-14 w-44 bg-blue-600/10 dark:bg-blue-900/40 rounded-lg animate-pulse mt-8" />
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              <div className="grid grid-cols-2 gap-6">
                <div className="h-24 bg-slate-50 dark:bg-slate-800/40 rounded-lg animate-pulse" />
                <div className="h-24 bg-slate-50 dark:bg-slate-800/40 rounded-lg animate-pulse" />
              </div>

              <div className="space-y-6">
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
