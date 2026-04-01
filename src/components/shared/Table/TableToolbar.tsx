import * as React from "react";
import { TableSearch } from "./TableSearch";
import { FilterConfig, TableFilters } from "./TableFilter";

interface TableToolbarProps {
  searchProps: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
  };
  filterProps?: {
    filters: FilterConfig[];
    value: Record<string, string>;
    onChange: (val: Record<string, string>) => void;
    onReset: () => void;
  };
  /**
   * Slot for primary actions (e.g., Add Button, Export Button)
   * This removes the hardcoded "Add Client" dependency.
   */
  children?: React.ReactNode;
}

export function TableToolbar({
  searchProps,
  filterProps,
  children,
}: TableToolbarProps) {
  return (
    <div className="mb-4 flex w-full min-w-0 max-w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Left Side: Search */}
      <div className="flex min-w-0 flex-1 items-center">
        <TableSearch {...searchProps} />
      </div>

      {/* Right Side: Filters + Actions */}
      <div className="flex max-w-full flex-row items-center gap-2 overflow-x-auto pb-1 md:pb-0">
        {filterProps && (
          <TableFilters
            filters={filterProps.filters}
            value={filterProps.value}
            onChange={filterProps.onChange}
            onReset={filterProps.onReset}
          />
        )}

        {/* Render passed actions (Buttons, etc.) */}
        {children && (
          <div className="ml-auto flex shrink-0 items-center gap-2">{children}</div>
        )}
      </div>
    </div>
  );
}
