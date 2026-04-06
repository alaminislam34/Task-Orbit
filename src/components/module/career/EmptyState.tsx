import React from "react";
import { SearchX, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  onReset?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 p-8 text-center bg-white dark:bg-slate-900 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 transition-all">
      {/* Visual Illustration Area */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-2xl opacity-50 animate-pulse"></div>
        <div className="relative w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm">
          <SearchX className="w-12 h-12 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      {/* Text Content */}
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        No matches found
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
        We couldn't find any jobs matching your current search or filters. Try
        adjusting your keywords or clearing the filters to see more
        opportunities.
      </p>

      {/* Action Button */}
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
