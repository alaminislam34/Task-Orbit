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
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: {
    name: string;
    logoUrl: string;
    website: string;
  };
  location: {
    city: string;
    country: string;
    remote: boolean;
  };
  employmentType: string;
  experienceLevel: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  category: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState({
    category: "All",
    level: "All",
    type: "All",
  });
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch("/data/jobs.json");
        const data = await response.json();
        setJobs(data);
        if (data.length > 0) setSelectedJob(data[0]);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filters.category === "All" || job.category === filters.category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#f3f2f1] dark:bg-slate-950 pb-10">
      {/* Search Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <HeroSection onSearch={setSearchQuery} />
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
                  {filteredJobs.length} Jobs Found
                </h2>
              </div>

              <div className="space-y-3">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 shadow-sm ${
                      selectedJob?.id === job.id
                        ? "border-blue-600 bg-white dark:bg-slate-900 shadow-blue-100 dark:shadow-none"
                        : "border-white dark:border-slate-900 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-800"
                    }`}
                  >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm mt-1">
                      {job.company.name}
                    </p>

                    <div className="flex items-center gap-3 text-slate-500 text-sm mt-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} /> {job.location.city}
                      </div>
                      {job.location.remote && (
                        <div className="flex items-center gap-1 text-green-600 font-medium">
                          <Globe size={14} /> Remote
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight">
                        {job.employmentType.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredJobs.length === 0 && (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                    <p className="text-slate-500">
                      No jobs match your search criteria.
                    </p>
                  </div>
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
                  className="hidden lg:block flex-1 sticky top-20 h-[calc(100vh-150px)] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl custom-scrollbar"
                >
                  <div className="p-10">
                    <div className="mb-8 sticky top-0">
                      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                        {selectedJob.title}
                      </h1>
                      <div className="flex items-center gap-3">
                        <a
                          href={selectedJob.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-lg hover:underline font-bold flex items-center gap-1"
                        >
                          {selectedJob.company.name} <ExternalLink size={16} />
                        </a>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                          {selectedJob.location.city},{" "}
                          {selectedJob.location.country}
                        </span>
                      </div>

                      <div className="mt-8 flex gap-4">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg shadow-blue-200 dark:shadow-none active:scale-95">
                          Apply Now
                        </button>
                        <button className="px-6 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 font-bold">
                          Save
                        </button>
                      </div>
                    </div>

                    <hr className="my-10 border-slate-100 dark:border-slate-800" />

                    <div className="space-y-10">
                      {/* Job Highlights Grid */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">
                            Salary
                          </p>
                          <p className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                            <DollarSign size={20} className="text-green-600" />
                            {selectedJob.salary.min.toLocaleString()} -{" "}
                            {selectedJob.salary.max.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">
                            Level
                          </p>
                          <p className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                            <Briefcase size={20} className="text-blue-600" />
                            {selectedJob.experienceLevel}
                          </p>
                        </div>
                      </div>

                      {/* Content Sections */}
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                          Job Overview
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[17px]">
                          {selectedJob.description}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                          Responsibilities
                        </h4>
                        <ul className="space-y-3">
                          {selectedJob.responsibilities.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex gap-4 text-slate-600 dark:text-slate-400 text-[16px]"
                            >
                              <span className="text-blue-600 font-black shrink-0">
                                •
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
                          Technical Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skills.map((skill) => (
                            <span
                              key={skill}
                              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm"
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
