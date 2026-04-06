"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down";
  className?: string;
};

export const StatCard = ({
  label,
  value,
  change,
  icon,
  trend,
  className,
}: StatCardProps) => {
  const isPositive = trend === "up" || (change && change > 0);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border/60 bg-card p-5 transition-all duration-300",
        "hover:border-emerald-500/40 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)]",
        className,
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          {icon && (
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 group-hover:scale-110 transition-transform">
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-black text-foreground">{value}</h3>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md",
                isPositive
                  ? "text-emerald-600 bg-emerald-500/10"
                  : "text-rose-600 bg-rose-500/10",
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
