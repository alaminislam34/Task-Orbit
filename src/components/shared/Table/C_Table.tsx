import React, { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "./TableSkeleton";

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface CommonTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  actions?: (row: T) => ReactNode;
  pagination?: PaginationProps;
  children?: ReactNode; // Slot for search/filters
  className?: string;
}

const CommonTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data found",
  actions,
  pagination,
  children,
  className,
}: CommonTableProps<T>) => {
  const columnCount = columns.length + (actions ? 1 : 0);

  return (
    <div className={cn("w-full min-w-0 max-w-full space-y-4", className)}>
      {/* Top Section Slot */}
      {children && (
        <div className="w-full min-w-0 max-w-full flex items-center justify-between gap-4">
          {children}
        </div>
      )}

      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead 
                  key={idx} 
                  className={cn("font-semibold text-muted-foreground", col.className)}
                >
                  {col.header}
                </TableHead>
              ))}
              {actions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {loading ? (
              <TableSkeleton columnsCount={columns.length} hasActions={!!actions} />
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Inbox className="mb-4 h-10 w-10 opacity-20" />
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex} 
                  className="group transition-colors data-[state=selected]:bg-muted"
                >
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} className={cn("py-4", col.className)}>
                      {col.render ? col.render(row) : (row[col.accessor as keyof T] as ReactNode)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right py-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {actions(row)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {pagination && !loading && data.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{pagination.page}</span> of{" "}
            <span className="font-medium text-foreground">{pagination.totalPages}</span>
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonTable;