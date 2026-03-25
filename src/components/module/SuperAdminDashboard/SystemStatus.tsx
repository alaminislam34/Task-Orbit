"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type SystemStatus = {
  label: string;
  value: string | number;
  status: "healthy" | "warning" | "critical";
  icon: React.ReactNode;
};

type SystemStatusProps = {
  items: SystemStatus[];
  title?: string;
};

const statusIcons = {
  healthy: (
    <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-pulse" />
  ),
  warning: <AlertCircle className="w-5 h-5 text-amber-500 animate-pulse" />,
  critical: <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />,
};

const statusBg = {
  healthy: "bg-emerald-500/10 border-emerald-500/30",
  warning: "bg-amber-500/10 border-amber-500/30",
  critical: "bg-rose-500/10 border-rose-500/30",
};

export const SystemStatus = ({
  items,
  title = "System Status",
}: SystemStatusProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-foreground">{title}</h3>

      <div className="grid grid-cols-1 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "relative overflow-hidden rounded-lg border p-3 transition-all duration-300",
              "hover:shadow-sm",
              statusBg[item.status],
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0">{item.icon}</div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm font-black text-foreground">
                    {item.value}
                  </p>
                </div>
              </div>
              {statusIcons[item.status]}
            </div>

            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
};
