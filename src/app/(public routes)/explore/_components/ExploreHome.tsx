"use client";

import React, { useState, useEffect } from "react";
import ExploreHero from "./ExploreHero";
import ExploreToolbar from "./Toolbar";
import ExploreCard from "./ExploreCard";
import ExplorePagination from "./ExplorePagination";
import { useServices } from "@/hooks/useServices";
import { motion, AnimatePresence } from "motion/react";

const Explore = () => {
  const [activeTab, setActiveTab] = useState<"services" | "jobs">("services");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [category, setCategory] = useState("All Categories");
  const { data: servicesResponse, isLoading: isLoadingServices } = useServices();
  const services = servicesResponse || [];
  
  // Filtering logic based on category if needed can be added here
  const filteredData = category === "All Categories" 
    ? services 
    : services.filter(s => s.category === category);

  const totalResults = filteredData.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  // Simple client side pagination
  const startIndex = (currentPage - 1) * pageSize;
  const data = filteredData.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    // Reset to page 1 when category changes
    setCurrentPage(1);
  }, [category]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => {
      window.scrollTo({ top: 400, behavior: "smooth" });
    }, 100);
  };

  const isLoading = isLoadingServices;

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
                  className="h-100 w-full bg-muted/50 animate-pulse rounded-lg border border-border/50"
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
