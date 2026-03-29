"use client";
import React, { useState } from "react";
import { Search, MapPin, Briefcase, Globe } from "lucide-react";

interface HeroProps {
  onSearch: (query: string, location: string, isRemote: boolean) => void;
}

export default function HeroSection({ onSearch }: HeroProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);

  const handleSearch = () => {
    onSearch(query, location, isRemote);
  };

  return (
    <section className="bg-white dark:bg-slate-900 py-12 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Find your next <span className="text-blue-600">career move</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Explore thousands of jobs from startups to Fortune 500 companies.
          </p>
        </div>

        {/* Professional Search Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-2">
            {/* "What" Input */}
            <div className="relative flex-1 w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Divider (Desktop Only) */}
            <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-700" />

            {/* "Where" Input */}
            <div className="relative flex-1 w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <MapPin size={18} />
              </div>
              <input
                type="text"
                placeholder="City, state, or 'Remote'"
                className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md active:scale-95"
            >
              Find Jobs
            </button>
          </div>

          {/* Quick Filters / Remote Toggle */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
              />
              <span className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                <Globe size={14} /> Remote only
              </span>
            </label>

            <span className="text-slate-300 dark:text-slate-700">|</span>

            <div className="flex gap-3">
              <span className="text-slate-400 font-medium">Trending:</span>
              {["Frontend", "Marketing", "Sales"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 underline decoration-slate-300 underline-offset-4"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
