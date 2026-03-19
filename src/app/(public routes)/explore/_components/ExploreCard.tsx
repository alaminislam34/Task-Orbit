"use client";

import React from "react";
import Image from "next/image";
import { Star, Clock, MapPin, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CardProps {
  type: "service" | "job";
  viewMode: "grid" | "list";
}

const ExploreCard = ({ type, viewMode }: CardProps) => {
  const isGrid = viewMode === "grid";

  return (
    <div
      className={cn(
        "group bg-card border border-border rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-emerald-500/30",
        !isGrid && "flex flex-row h-auto md:h-52",
      )}
    >
      {/* Thumbnail Area */}
      <div
        className={cn(
          "relative bg-muted/50 overflow-hidden",
          isGrid ? "aspect-4/3" : "w-full md:w-72 shrink-0",
        )}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Placeholder for Image */}
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <Image
            src="/images/seo.jpg"
            alt="Work Thumbnail"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground border-none font-bold">
          {type === "service" ? "Pro Service" : "Full Time"}
        </Badge>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <span className="text-[10px] font-black text-emerald-600">AA</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none">MD. Al Amin</span>
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">
              Next.js Expert
            </span>
          </div>
          <ArrowUpRight className="ml-auto w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
        </div>

        <h3 className="font-bold text-base md:text-lg leading-tight mb-4 line-clamp-2 group-hover:text-emerald-500 transition-colors">
          I will build high-end professional Bento Style UI for your SaaS
          application
        </h3>

        {/* Card Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              <span className="text-xs font-black">4.9</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">2 Days</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-emerald-600">$199</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreCard;
