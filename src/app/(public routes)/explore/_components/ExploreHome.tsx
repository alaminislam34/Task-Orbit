"use client";

import React, { useState, useEffect } from "react";
import ExploreHero from "./ExploreHero";
import ExploreToolbar from "./Toolbar";
import ExploreCard from "./ExploreCard";
import ExplorePagination from "./ExplorePagination"; // আগের তৈরি করা কম্পোনেন্টটি ইম্পোর্ট করুন
import { motion, AnimatePresence } from "motion/react";

const Explore = () => {
  const [activeTab, setActiveTab] = useState<"services" | "jobs">("services");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // ডামি ডাটা কাউন্ট (এটি পরে আপনার API থেকে আসবে)
  const totalResults = activeTab === "services" ? 1240 : 450;
  const totalPages = Math.ceil(totalResults / 12);
  const [pageSize, setPageSize] = useState(12);
  const [category, setCategory] = useState("All Categories"); // নতুন স্টেট

  // পেজ চেঞ্জ হ্যান্ডেলার
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);

    setTimeout(() => {
      setIsLoading(false);
      window.scrollTo({ top: 450, behavior: "smooth" });
    }, 600);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 pb-20">
      <ExploreHero />

      <ExploreToolbar
        activeTab={activeTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        category={category} // স্টেট পাস
        setCategory={setCategory} // ফাংশন পাস
      />

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
              Explore {activeTab === "services" ? "Services" : "Jobs"}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Showing{" "}
              <span className="text-foreground font-bold">
                {totalResults.toLocaleString()}
              </span>{" "}
              results found for your search {pageSize}
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Newest First
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-100 flex items-center justify-center"
            >
              {/* আপনি এখানে Skeleton ও দেখাতে পারেন */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-sm font-bold text-muted-foreground">
                  Updating Feed...
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "flex flex-col gap-6 max-w-5xl mx-auto"
              }
            >
              {Array.from({ length: pageSize }).map((_, i) => (
                <ExploreCard
                  key={i + currentPage * pageSize}
                  type={activeTab === "services" ? "service" : "job"}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {totalResults > 0 && (
          <div className="mt-16 pt-10 border-t border-border/50">
            <ExplorePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;
