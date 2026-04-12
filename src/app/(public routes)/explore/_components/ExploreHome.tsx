"use client";

import React, { useState, useEffect } from "react";
import ExploreHero from "./ExploreHero";
import ExploreToolbar from "./Toolbar";
import ExploreCard from "./ExploreCard";
import ExplorePagination from "./ExplorePagination";
import { useAllServices } from "@/hooks/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const Explore = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<"services" | "jobs">("services");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const pageSize = 12;

  const urlPage = Number(searchParams.get("page")) || 1;
  const urlCategory = searchParams.get("category") || "All Categories";
  const urlSearch = searchParams.get("search") || "";

  // Local state for instant input UI, synced with debounce
  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(search, 400);

  // When debounce triggers, push to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    // Only push if the search param actually differs to prevent loop
    if (searchParams.get("search") !== (debouncedSearch || null)) {
       params.set("page", "1");
       router.push(pathname + "?" + params.toString(), { scroll: false });
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  // Hook into our actual API
  const { data: servicesResponse, isLoading: isLoadingServices } = useAllServices({
    page: urlPage,
    limit: pageSize,
    search: urlSearch,
    categoryId: urlCategory !== "All Categories" ? urlCategory : undefined,
  });

  const services = servicesResponse?.data || [];
  const meta = servicesResponse?.meta;
  const totalResults = meta?.total || services.length;
  const totalPages = meta?.totalPages || Math.ceil(totalResults / pageSize);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(pathname + "?" + params.toString());
    setTimeout(() => window.scrollTo({ top: 400, behavior: "smooth" }), 100);
  };

  const handleCategoryChange = (newCat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCat === "All Categories") {
      params.delete("category");
    } else {
      params.set("category", newCat);
    }
    params.set("page", "1");
    router.push(pathname + "?" + params.toString(), { scroll: false });
  };
  
  const isLoading = isLoadingServices;

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 pb-20">
      <ExploreHero search={search} setSearch={setSearch} />

      <ExploreToolbar
        activeTab={activeTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        category={urlCategory}
        setCategory={handleCategoryChange}
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
              {services.map((item) => (
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
            currentPage={urlPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={(newSize) => {
              handlePageChange(1);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Explore;
