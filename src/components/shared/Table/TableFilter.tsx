"use client";

import * as React from "react";
import { ListFilter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export interface FilterConfig {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface TableFiltersProps {
  filters: FilterConfig[];
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  onReset?: () => void;
}

export function TableFilters({ filters, value, onChange, onReset }: TableFiltersProps) {
  const handleSelect = (key: string, selectedValue: string) => {
    onChange({ ...value, [key]: selectedValue });
  };

  const activeFilterCount = Object.values(value).filter(Boolean).length;

  return (
    <div className="flex flex-row items-center gap-2">
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={value[filter.key] || ""}
          onValueChange={(val) => handleSelect(filter.key, val as string)}
        >
          <SelectTrigger className="h-9 w-auto min-w-32.5 border-dashed">
            <div className="flex items-center gap-2">
              <ListFilter className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">{filter.label}</span>
              {value[filter.key] && (
                <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal lg:hidden">
                  1
                </Badge>
              )}
            </div>
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          onClick={onReset}
          className="h-9 px-2 lg:px-3 text-xs text-muted-foreground"
        >
          Reset
          <X className="ml-2 h-3 w-3" />
        </Button>
      )}
    </div>
  );
}