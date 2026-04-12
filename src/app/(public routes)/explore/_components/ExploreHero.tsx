"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExploreHeroProps {
  search: string;
  setSearch: (val: string) => void;
}

const ExploreHero = ({ search, setSearch }: ExploreHeroProps) => {
  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24 px-6 border-b border-border transition-colors duration-300">
      {/* Decorative Glows - Adjusted for both modes */}
      <div className="absolute top-0 right-0 w-80 md:w-125 h-80 md:h-125 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px] md:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 md:w-125 h-80 md:h-125 bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] md:blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight leading-[1.1]">
          Find the{" "}
          <span className="text-emerald-600 dark:text-emerald-500">
            Service
          </span>
        </h1>

        {/* Search Input Container */}
        <div className="relative group max-w-3xl mx-auto shadow-md dark:shadow-none overflow-hidden mt-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-500 transition-colors" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-16 pl-14 pr-36 bg-card dark:bg-slate-900/50 border-border text-foreground placeholder:text-muted-foreground text-lg focus-visible:ring-1 focus-visible:ring-emerald-500/30"
            placeholder="Try 'Next.js Developer' or 'UI/UX Designer'..."
          />

          <Button className="absolute right-2 top-2 h-12 rounded-lg px-8 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold transition-all active:scale-95">
            Search
          </Button>
        </div>

        {/* Trending Tags */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-10">
          <span className="text-muted-foreground text-sm font-semibold">
            Trending:
          </span>
          {["SaaS Dev", "Framer Motion", "Logo Design", "AI Specialist"].map(
            (tag) => (
              <Badge
                key={tag}
                onClick={() => setSearch(tag)}
                variant="outline"
                className="bg-accent/30 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 border-border text-muted-foreground cursor-pointer transition-all px-4 py-1.5 rounded-full font-medium"
              >
                {tag}
              </Badge>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default ExploreHero;
