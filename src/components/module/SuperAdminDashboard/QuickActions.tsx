"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type QuickActionItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  variant?: "default" | "secondary" | "warning" | "destructive";
};

type QuickActionsProps = {
  items: QuickActionItem[];
  title?: string;
  onAction?: (id: string) => void;
};

const variantStyles = {
  default:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20",
  secondary: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20",
  warning:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20",
  destructive:
    "bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20",
};

export const QuickActions = ({
  items,
  title = "Quick Actions",
  onAction,
}: QuickActionsProps) => {
  const [clicked, setClicked] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setClicked(id);
    onAction?.(id);
    setTimeout(() => setClicked(null), 1000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-foreground">{title}</h3>

      <div className="grid grid-cols-1 gap-2">
        {items.map((item) => (
          <Button
            key={item.id}
            onClick={() => handleClick(item.id)}
            variant="outline"
            className={cn(
              "h-auto flex-col items-start justify-start px-4 py-3 border transition-all duration-300",
              variantStyles[item.variant || "default"],
              clicked === item.id && "ring-2 ring-offset-2 ring-emerald-500",
            )}
          >
            <div className="flex items-start gap-3 w-full">
              <div className="mt-0.5 shrink-0">{item.icon}</div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-bold">{item.label}</p>
                <p className="text-xs opacity-75 mt-0.5">{item.description}</p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
