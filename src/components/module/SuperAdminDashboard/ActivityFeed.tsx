"use client";

import React, { useState } from "react";
import { MoreVertical, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "pending" | "warning" | "error";
  icon?: React.ReactNode;
  action?: string;
};

type ActivityFeedProps = {
  items: ActivityItem[];
  title?: string;
  subtitle?: string;
};

const statusColors = {
  success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  warning: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  error: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

export const ActivityFeed = ({
  items,
  title = "Recent Activity",
  subtitle,
}: ActivityFeedProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {title && (
        <div>
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group relative overflow-hidden rounded-lg border border-border/40 bg-card/50 px-4 py-3 transition-all duration-300",
              "hover:bg-card hover:border-border/60 hover:shadow-sm",
              expanded === item.id && "ring-2 ring-emerald-500/20",
            )}
          >
            <div className="flex items-start gap-3">
              {item.icon && (
                <div className="mt-1 shrink-0 rounded-md bg-muted p-2 text-muted-foreground group-hover:text-emerald-600 transition-colors">
                  {item.icon}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        `text-xs font-bold px-2 py-0.5 rounded-full border`,
                        statusColors[item.status],
                      )}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        }
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                          <Eye className="w-3.5 h-3.5 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {item.action && (
                          <DropdownMenuItem>{item.action}</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
};
