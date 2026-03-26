import React from "react";
import { Filter, X, ChevronDown } from "lucide-react";

interface FilterProps {
  filters: {
    category: string;
    level: string;
    type: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      category: string;
      level: string;
      type: string;
    }>
  >;
}

const JobFilters: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const categories = [
    "All",
    "Development",
    "Design",
    "Marketing",
    "Writing",
    "Management",
  ];
  const levels = ["All", "Entry", "Mid", "Expert"];
  const types = ["All", "Full-time", "Part-time", "Remote", "Freelance"];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: "All", level: "All", type: "All" });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Filter className="w-5 h-5 text-green-600" /> Filters
        </h3>
        <button
          onClick={clearFilters}
          className="text-xs text-green-600 hover:underline font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Filter Groups */}
      <div className="space-y-8">
        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Category
          </label>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  checked={filters.category === cat}
                  onChange={() => handleFilterChange("category", cat)}
                />
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-green-600 transition-colors">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Experience Level
          </label>
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange("level", e.target.value)}
            className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Job Type
          </label>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange("type", type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filters.type === type
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Range (Slider Placeholder) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Salary Range
          </label>
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>$0</span>
            <span>$200k+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
