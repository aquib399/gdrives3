"use client";

import { usePaginationQuery } from "./usePaginationQuery";
import { useCallback, useMemo, useState } from "react";
import { buildQueryParams } from "@/utils/filter";
import { Filter } from "@/types/filter-config";

export function useListing(initialFilters: Filter[] = []) {
  const { limit, page, search } = usePaginationQuery();
  const [activeFilters, setActiveFilters] = useState<Filter[]>(initialFilters);

  const updateFilters = useCallback((newFilters: Filter[]) => {
    setActiveFilters(newFilters);
  }, []);

  const processedFilters = useMemo(() => {
    const baseParams = Object.fromEntries(
      Object.entries({
        search,
        page,
        limit
      }).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined
      )
    );
    return buildQueryParams(activeFilters, baseParams);
  }, [activeFilters, search, page, limit]);

  return {
    activeFilters,
    updateFilters,
    processedFilters,
    limit,
    page,
    search
  };
}
