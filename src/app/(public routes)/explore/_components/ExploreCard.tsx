"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Clock, Heart, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CardProps {
  data: any; // Ideally use the Service interface we discussed earlier
  type: "service" | "job";
  viewMode: "grid" | "list";
}

const ExploreCard = ({ data, type, viewMode }: CardProps) => {
  const isGrid = viewMode === "grid";
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);

  // Extracting from your specific JSON structure
  const startingPrice = data.packages?.[0]?.price || 0;
  const seller = data.seller || {};

  return (
    <div
      className={cn(
        "group bg-card border border-border/60 rounded-lg overflow-hidden transition-all duration-300",
        "hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] hover:border-emerald-500/40",
        isGrid
          ? "flex flex-col h-full"
          : "flex flex-col md:flex-row w-full md:min-h-56",
      )}
    >
      {/* Thumbnail Area */}
      <div
        onClick={() => router.push(`/explore/${data.slug}`)}
        className={cn(
          "relative bg-muted/30 overflow-hidden cursor-pointer shrink-0",
          isGrid ? "aspect-16/10" : "w-full md:w-[320px]",
        )}
      >
        <Image
          src={data.media?.thumbnail || "/images/placeholder.jpg"}
          alt={data.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

        <div className="absolute top-3 left-3 flex gap-2">
          {data.isPro && (
            <Badge className="bg-emerald-500 text-white border-none font-bold text-[10px] px-2 py-0.5 uppercase tracking-wider shadow-lg">
              Pro Service
            </Badge>
          )}
          {data.isVerified && (
            <Badge className="bg-blue-600 text-white border-none font-bold text-[10px] px-2 py-0.5 uppercase tracking-wider shadow-lg">
              Verified
            </Badge>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-white hover:text-rose-500 transition-all border border-white/10"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isLiked && "fill-current text-rose-500",
            )}
          />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
              {seller.avatar ? (
                <Image
                  src={seller.avatar}
                  alt={seller.name}
                  width={32}
                  height={32}
                />
              ) : (
                <span className="text-[10px] font-bold text-emerald-700">
                  {seller.name?.substring(0, 2).toUpperCase() || "AA"}
                </span>
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold hover:text-emerald-600 truncate transition-colors cursor-pointer">
                {seller.name}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-tight">
              {seller.level}
            </span>
          </div>
          <ArrowUpRight className="ml-auto w-4 h-4 text-muted-foreground/30 group-hover:text-emerald-500 transition-all group-hover:-translate-y-0.5" />
        </div>

        {/* Title */}
        <h3
          onClick={() => router.push(`/explore/${data.slug}`)}
          className="font-bold text-sm md:text-base leading-tight mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors cursor-pointer"
        >
          {data.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-foreground">
              {data.rating}
            </span>
            <span className="text-xs text-muted-foreground">
              (
              {data.reviewCount > 1000
                ? `${(data.reviewCount / 1000).toFixed(1)}k+`
                : data.reviewCount}
              )
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium italic">
              {data.packages?.[0]?.deliveryTime}d delivery
            </span>
          </div>
        </div>

        {/* Footer: Price */}
        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
              Starting at
            </span>
            <p className="text-lg font-black text-foreground">
              ${startingPrice}
            </p>
          </div>

          <button
            onClick={() => router.push(`/explore/${data.slug}`)}
            className={cn(
              "px-5 py-2.5 bg-emerald-500 text-white text-xs font-black rounded-lg transition-all",
              "hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95",
              isGrid
                ? "hidden md:block opacity-0 group-hover:opacity-100"
                : "block",
            )}
          >
            View Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreCard;
