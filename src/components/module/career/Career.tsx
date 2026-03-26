"use client";
import React, { useState, useEffect } from "react";
import { Career } from "@/types/data.types";
import HeroSection from "./HeroSection";
import JobFilters from "./FilterJobs";
import JobList from "./JobList";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    level: "All",
    type: "All",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Career[]>([]);

  // Simulate API Fetch
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      // Replace with actual API call: fetch('/api/jobs')
      setTimeout(() => {
        setJobs(MOCK_JOBS);
        setIsLoading(false);
      }, 1000);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filters.category === "All" || job.category === filters.category;
    const matchesLevel = filters.level === "All" || job.level === filters.level;
    const matchesType = filters.type === "All" || job.type === filters.type;

    return matchesSearch && matchesCategory && matchesLevel && matchesType;
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <HeroSection onSearch={setSearchQuery} />

      <div className="max-w-360 w-11/12 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <JobFilters filters={filters} setFilters={setFilters} />
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Showing {filteredJobs.length} Jobs
              </h2>
            </div>

            <JobList jobs={filteredJobs} isLoading={isLoading} />
          </section>
        </div>
      </div>
    </main>
  );
}

const MOCK_JOBS: Career[] = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    company: "TechFlow",
    location: "San Francisco, CA",
    type: "Full-time",
    level: "Expert",
    salary: "$120k - $150k",
    category: "Development",
    tags: ["React", "Node.js", "PostgreSQL"],
    description:
      "Looking for a seasoned developer to lead our core product team...",
    postedAt: "2 hours ago",
  },
  // Add more mock items here...
];
