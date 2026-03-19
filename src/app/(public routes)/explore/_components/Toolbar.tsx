"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronDown,
  Check,
  CircleDot,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const categories = [
  "All Categories",
  "Web Development",
  "Graphics Design",
  "Digital Marketing",
  "Video Editing",
  "AI Services",
];

interface ToolbarProps {
  activeTab: "services" | "jobs";
  viewMode: "grid" | "list";
  setViewMode: (val: "grid" | "list") => void;
  category: string;
  setCategory: (val: string) => void;
}

const ExploreToolbar = ({
  activeTab,
  viewMode,
  setViewMode,
  category,
  setCategory,
}: ToolbarProps) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setCategory("All Categories");
  };

  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border py-4 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 w-full justify-between">
          <div className="flex gap-2">
            {/* --- Fully Responsive Filter Sidebar --- */}
            <Sheet>
              <SheetTrigger>
                <Button
                  variant="outline"
                  className="rounded-xl font-bold h-11 px-4 md:px-5 gap-2 border-border bg-card hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                  <span className="hidden xs:inline">Filter</span>
                </Button>
              </SheetTrigger>

              {/* Responsive width classes: w-full for mobile, sm:max-w-md for tablets/desktop */}
              <SheetContent
                side="right"
                className="w-full sm:max-w-md flex flex-col h-full rounded-l-none sm:rounded-l-[2rem] border-l-border p-0"
              >
                <div className="flex flex-col h-full overflow-y-auto">
                  <SheetHeader className="p-6 border-b border-border text-left">
                    <SheetTitle className="text-2xl font-black">
                      Advanced Filters
                    </SheetTitle>
                    <SheetDescription>
                      Narrow down your search for {activeTab}.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="p-6 space-y-8 flex-1">
                    {/* Price Range Filter */}
                    <div className="space-y-4">
                      <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                        Budget Range ($)
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          placeholder="Min"
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="h-12 rounded-xl bg-muted/30 border-border focus-visible:ring-emerald-500 transition-all"
                        />
                        <span className="text-muted-foreground font-bold">
                          to
                        </span>
                        <Input
                          placeholder="Max"
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="h-12 rounded-xl bg-muted/30 border-border focus-visible:ring-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Delivery Time */}
                    <div className="space-y-4">
                      <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                        Delivery Time
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["24 Hours", "3 Days", "7 Days", "Anytime"].map(
                          (time) => (
                            <Button
                              key={time}
                              variant="outline"
                              className="rounded-xl text-xs font-bold h-11 border-border hover:border-emerald-500/50 hover:bg-emerald-500/5"
                            >
                              {time}
                            </Button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Responsive Footer: Sticky at bottom */}
                  <SheetFooter className="p-6 border-t border-border bg-background/50 backdrop-blur-sm sticky bottom-0 mt-auto">
                    <div className="flex flex-col w-full gap-3">
                      <Button className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-500/20 text-white">
                        Apply Filters
                      </Button>
                      <Button
                        onClick={resetFilters}
                        variant="ghost"
                        className="w-full gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl font-bold"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset All
                      </Button>
                    </div>
                  </SheetFooter>
                </div>
              </SheetContent>
            </Sheet>

            {/* --- Category Dropdown --- */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  className="rounded-xl font-bold h-11 px-4 md:px-5 gap-2 border-border bg-card hover:border-emerald-500/50 transition-all"
                >
                  <span className="text-emerald-500">
                    <CircleDot className="w-3 h-3" />
                  </span>
                  <span className="truncate max-w-20 sm:max-w-37.5">
                    {category}
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 sm:w-64 rounded-2xl p-2 shadow-2xl border-border animate-in fade-in-0 zoom-in-95"
              >
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "flex items-center justify-between rounded-xl cursor-pointer py-2.5 px-3 font-medium transition-colors mb-1 last:mb-0",
                      category === cat
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "hover:bg-muted",
                    )}
                  >
                    {cat}
                    {category === cat && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* --- View Toggler --- */}
          <div className="flex bg-muted p-1 rounded-xl border border-border shrink-0">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-lg h-9 w-9 transition-all",
                viewMode === "grid" &&
                  "bg-background shadow-sm text-emerald-600",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded-lg h-9 w-9 transition-all",
                viewMode === "list" &&
                  "bg-background shadow-sm text-emerald-600",
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreToolbar;
