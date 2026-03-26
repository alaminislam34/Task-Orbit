import { Search } from "lucide-react";

export default function HeroSection({ onSearch }: { onSearch: (val: string) => void }) {
  return (
    <section className="relative py-20 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
          Find Your <span className="text-green-600">Dream Job</span> on TaskOrbit
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Explore thousands of job opportunities from top-rated companies and recruiters worldwide.
        </p>
        
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title, company, or keywords..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}