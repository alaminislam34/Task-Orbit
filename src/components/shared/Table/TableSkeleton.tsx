import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

interface TableSkeletonProps {
  columnsCount: number;
  rowsCount?: number;
  hasActions?: boolean;
}

export function TableSkeleton({ columnsCount, rowsCount = 5, hasActions }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowsCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columnsCount + (hasActions ? 1 : 0) }).map((_, colIndex) => (
            <TableCell key={colIndex} className="py-4">
              <Skeleton className="h-4 w-full max-w-30" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}