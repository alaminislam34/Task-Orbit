"use client";

import React, { useState, useEffect } from "react";
import ExploreHero from "./ExploreHero";
import ExploreToolbar from "./Toolbar";
import ExploreCard from "./ExploreCard";
import ExplorePagination from "./ExplorePagination";
import { motion, AnimatePresence } from "motion/react";

const Explore = () => {
  const [activeTab, setActiveTab] = useState<"services" | "jobs">("services");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  const pageSize = 12;
  const [category, setCategory] = useState("All Categories");

  // Fetching data from public/data/services.json
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/data/services.json");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        // Slight delay for smooth transition
        setTimeout(() => setIsLoading(false), 600);
      }
    };
    fetchData();
  }, [activeTab]);

  const totalResults = data.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    setTimeout(() => {
      setIsLoading(false);
      window.scrollTo({ top: 400, behavior: "smooth" });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 pb-20">
      <ExploreHero />

      <ExploreToolbar
        activeTab={activeTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        category={category}
        setCategory={setCategory}
      />

      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Explore {activeTab === "services" ? "Services" : "Jobs"}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Showing{" "}
              <span className="text-emerald-500 font-bold">
                {totalResults.toLocaleString()}
              </span>{" "}
              results found
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "flex flex-col gap-6"
              }
            >
              {[...Array(pageSize)].map((_, i) => (
                <div
                  key={i}
                  className="h-100 w-full bg-muted/50 animate-pulse rounded-xl border border-border/50"
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "flex flex-col gap-6"
              }
            >
              {data.map((item) => (
                <ExploreCard
                  key={item.id}
                  data={item}
                  type={activeTab === "services" ? "service" : "job"}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 pt-10 border-t border-border/50">
          <ExplorePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={(newSize) => {
              setCurrentPage(1);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Explore;
