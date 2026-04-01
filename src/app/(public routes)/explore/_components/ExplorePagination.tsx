"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  LayoutList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // নতুন প্রপস যোগ করা হয়েছে
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

const ExplorePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: PaginationProps) => {
  const renderPageNumbers = () => {
    const pages = [];
    // লজিক আগের মতই আছে...
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(i)}
            className={cn(
              "w-10 h-10 rounded-lg font-bold transition-all",
              currentPage === i
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 border-none"
                : "border-border hover:border-emerald-500/50 hover:text-emerald-500 bg-card",
            )}
          >
            {i}
          </Button>,
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <div
            key={i}
            className="flex items-center justify-center w-10 h-10 text-muted-foreground"
          >
            <MoreHorizontal className="w-4 h-4" />
          </div>,
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-16 pb-10 border-t border-border/50 pt-10">
      {/* 1. Page Size Selector (Left Side) */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-muted-foreground tracking-wider">
          Show items per page:
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-lg px-4 gap-2 font-bold border-border bg-card"
              />
            }
          >
            {pageSize} <LayoutList className="w-3.5 h-3.5 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="rounded-lg min-w-25">
            {[8, 16, 32, 64].map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => onPageSizeChange(size)}
                className={cn(
                  "cursor-pointer font-bold justify-center",
                  pageSize === size && "text-emerald-500 bg-emerald-500/10",
                )}
              >
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 2. Central Pagination Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-10 h-10 rounded-lg border-border bg-card hover:border-emerald-500/50 disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2">{renderPageNumbers()}</div>

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-10 h-10 rounded-lg border-border bg-card hover:border-emerald-500/50 disabled:opacity-30 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* 3. Status Info (Right Side) */}
      <p className="text-xs font-medium text-muted-foreground order-first md:order-last">
        Page <span className="text-foreground font-black">{currentPage}</span>{" "}
        of <span className="text-foreground font-black">{totalPages}</span>
      </p>
    </div>
  );
};

export default ExplorePagination;
