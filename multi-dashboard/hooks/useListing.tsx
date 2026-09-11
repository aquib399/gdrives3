"use client";

import { usePaginationQuery } from "./usePaginationQuery";
import { useCallback, useMemo, useState } from "react";
import { buildQueryParams, QueryParams } from "@/utils/filter";
import { Filter } from "@/types/filter-config";

export interface ListingState {
  activeFilters: Filter[];
  activeFilterCount: number;
  updateFilters: (filters: Filter[]) => void;
  clearFilters: () => void;
  processedFilters: QueryParams;
  limit: string;
  page: string;
  search: string;
}

export function useListing(initialFilters: Filter[] = []) {
  const { limit, page, search } = usePaginationQuery();
  const [activeFilters, setActiveFilters] = useState<Filter[]>(initialFilters);

  const updateFilters = useCallback((newFilters: Filter[]) => {
    setActiveFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  const processedFilters = useMemo(() => {
    const baseParams = { search, page, limit };
    return buildQueryParams(activeFilters, baseParams);
  }, [activeFilters, search, page, limit]);

  return {
    activeFilters,
    activeFilterCount: activeFilters.length,
    updateFilters,
    clearFilters,
    processedFilters,
    limit,
    page,
    search
  } satisfies ListingState;
}
