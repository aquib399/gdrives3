"use client";

import { useMemo } from "react";
import {
  Pagination,
  PaginationNext,
  PaginationItem,
  PaginationLink,
  PaginationLimit,
  PaginationTotal,
  PaginationContent,
  PaginationEllipsis,
  PaginationPrevious
} from "@/components/ui/pagination";

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 3) return [1, 2, 3, 4, "...", totalPages];

  if (page >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    ];
  }

  return [1, "...", page - 1, page, page + 1, "...", totalPages];
}

export function DataTablePagination({
  page,
  totalPages,
  limit,
  totalResults,
  onPageChange,
  onLimitChange
}: DataTablePaginationProps) {
  const pages = useMemo(() => getPageNumbers(page, totalPages), [
    page,
    totalPages
  ]);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        <PaginationLimit limit={limit} onLimitChange={onLimitChange} />
        <PaginationTotal totalResults={totalResults} />
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className={
                page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            />
          </PaginationItem>

          {pages.map((p, index) =>
            p === "..." ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  onClick={() => onPageChange(p)}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              className={
                page >= totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
