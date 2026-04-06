"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TableSearchProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  delay?: number;
}

export function TableSearch({
  value: externalValue,
  onChange,
  placeholder = "Search...",
  className,
  delay = 400,
}: TableSearchProps) {
  const [localValue, setLocalValue] = React.useState(externalValue || "");

  // Sync local state if external value changes (e.g., on Reset)
  React.useEffect(() => {
    setLocalValue(externalValue || "");
  }, [externalValue]);

  // Debounce logic
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== externalValue) {
        onChange(localValue);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [localValue, delay, onChange, externalValue]);

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {localValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 hover:bg-transparent"
          onClick={() => setLocalValue("")}
        >
          <X className="h-3 w-3 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}