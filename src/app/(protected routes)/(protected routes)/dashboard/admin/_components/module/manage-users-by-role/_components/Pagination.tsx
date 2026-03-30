import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        size="sm"
        variant="outline"
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>

      <div className="flex flex-wrap items-center gap-1">
        {pages.map((pageNumber) => (
          <Button
            className="min-w-8"
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            size="sm"
            variant={pageNumber === page ? "default" : "outline"}
          >
            {pageNumber}
          </Button>
        ))}
      </div>

      <Button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        size="sm"
        variant="outline"
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export default Pagination;
