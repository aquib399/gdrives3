"use client";

import { DataTablePagination } from "@/components/table-pagination";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import { Filter, SchemaConfig } from "@/types/filter-config";
import { usePathname, useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import { SearchBar } from "./search-bar";
import { FilterBuilder } from "./filter";
import { ArrowDown, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { toSearchParams } from "@/utils/filter";
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  cloneElement,
  isValidElement,
  useMemo
} from "react";

export type ColumnVariant = "media" | "text" | "text-sm" | "badge" | "actions";

export type ColumnDef<T> = {
  [K in keyof T]-?: {
    header: string | React.ReactNode;
    accessorKey: K;
    Cell?: (item: T) => React.ReactNode;
    renderExpanded?: (item: T) => {
      Component: React.ReactNode;
      enabled: boolean;
    };
    valueFormatter?: (value: T[K]) => any;
    headerClassName?: string;
    cellClassName?: string;
    variant?: ColumnVariant;
  };
}[keyof T];

export interface ListingPageProps<T> {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  data: T[];
  isPending: boolean;
  error: Error | null;
  columns: ColumnDef<T>[];
  totalPages: number;
  totalResults: number;
  skeleton?: React.ReactNode;
  emptyState?: React.ReactNode;
  getRowKey?: (item: T) => React.Key;
  getRowHref?: (item: T) => string;
  updateFilters: (filters: Filter[]) => void;
  HeaderUtils?: React.ReactNode;
  schemaConfig: SchemaConfig<any>;
  activeFilters: Filter[];
  refetch: () => void;
  isRefetching: boolean;
  useLimitedheight?: boolean | string;
}

export function ListingContent<T>(props: ListingPageProps<T>) {
  const {
    title,
    description,
    searchPlaceholder = "Search...",
    data,
    isPending,
    columns,
    totalPages,
    error,
    useLimitedheight,
    totalResults,
    skeleton,
    updateFilters,
    activeFilters: rawActiveFilters,
    schemaConfig,
    HeaderUtils,
    isRefetching,
    refetch,
    emptyState = (
      <div className="text-muted-foreground p-6 text-center text-sm">
        No results found.
      </div>
    ),
    getRowKey,
    getRowHref
  } = props;

  const router = useRouter();
  const pathname = usePathname();
  const filtersFromParams = usePaginationQuery();

  const currentPage = filtersFromParams.page;
  const currentLimit = filtersFromParams.limit;

  const [searchTerm, setSearchTerm] = useState(filtersFromParams.search ?? "");

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [stableTotalPages, setStableTotalPages] = useState(totalPages);
  const [stableTotalResults, setStableTotalResults] = useState(totalResults);

  const previousPageRef = useRef(currentPage);
  const previousLimitRef = useRef(currentLimit);

  const [loadingReason, setLoadingReason] = useState<
    "initial" | "limit" | "page" | "other"
  >("initial");

  const debouncedSearchTerm = useDebounce(searchTerm);

  const [expandedCells, setExpandedCells] = useState<
    Record<string, undefined | number>
  >({});

  const getSearchParams = useCallback(
    () => toSearchParams(filtersFromParams),
    [filtersFromParams]
  );

  useEffect(() => {
    if (previousLimitRef.current !== currentLimit) {
      setLoadingReason("limit");
    } else if (previousPageRef.current !== currentPage) {
      setLoadingReason("page");
    }

    previousPageRef.current = currentPage;
    previousLimitRef.current = currentLimit;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpandedCells({});
  }, [currentPage, currentLimit]);

  useEffect(() => {
    if (!isPending) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasLoadedOnce(true);
      setStableTotalPages(totalPages);
      setStableTotalResults(totalResults);
      setLoadingReason("other");
    }
  }, [isPending, totalPages, totalResults]);

  const showPaginationSkeleton = !hasLoadedOnce || loadingReason === "limit";

  const showPaginationWhileLoading =
    isPending && hasLoadedOnce && !showPaginationSkeleton;

  const renderedSkeleton =
    skeleton && isValidElement(skeleton)
      ? cloneElement(
          skeleton as React.ReactElement<{
            showPaginationSkeleton?: boolean;
          }>,
          { showPaginationSkeleton }
        )
      : skeleton;

  useEffect(() => {
    const params = getSearchParams();

    const value = debouncedSearchTerm.trim();

    const currentSearch = filtersFromParams.search.trim();

    if (currentSearch === value) return;

    if (value) {
      params.set("search", value);
      params.set("page", "1");
    } else {
      params.delete("search");
    }

    router.replace(params.toString() ? `${pathname}?${params}` : pathname, {
      scroll: false
    });
  }, [
    debouncedSearchTerm,
    filtersFromParams,
    getSearchParams,
    pathname,
    router
  ]);

  const replaceQuery = (params: URLSearchParams) => {
    router.replace(`${pathname}?${params}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    const params = getSearchParams();

    params.set("page", page.toString());

    replaceQuery(params);
  };

  const handleLimitChange = (value: string) => {
    const params = getSearchParams();

    params.set("limit", value);
    params.set("page", "1");

    replaceQuery(params);
  };

  const activeFilters = useMemo(() => {
    const keysInSchema = new Set(Object.keys(schemaConfig.allowedFilters));
    return rawActiveFilters.filter((filter) => keysInSchema.has(filter.field));
  }, [rawActiveFilters, schemaConfig.allowedFilters]);

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="w-full shrink-0 px-6 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1 text-sm">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchPlaceholder={searchPlaceholder}
          />

          <FilterBuilder
            schema={schemaConfig}
            onApply={updateFilters}
            activeFilters={activeFilters}
          />

          <Button
            onClick={refetch}
            variant="outline"
            size={"lg"}
            disabled={isRefetching || isPending}
          >
            <RefreshCw className={isRefetching ? "animate-spin" : ""} />
            Refresh
          </Button>

          {HeaderUtils ?? ""}
        </div>
      </div>

      {isPending && renderedSkeleton}

      {!isPending && !error && data.length === 0 && emptyState}
      {error ? (
        <p className="text-destructive flex h-full items-center justify-center text-center text-xl">
          {error.message}
        </p>
      ) : null}

      {!isPending && data.length > 0 && (
        <div
          className={cn(
            "mx-auto flex min-h-0 w-full flex-col px-6 pb-3",
            useLimitedheight ? cn(useLimitedheight) : "flex-1"
          )}
        >
          <div className="border-border bg-card relative min-h-0 flex-1 overflow-auto rounded-xl border">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted border-border sticky top-0 z-10 border-b text-xs tracking-wider uppercase">
                <tr>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className={cn("px-6 py-4 font-bold", col.headerClassName)}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-border divide-y">
                {data.map((item, i) => {
                  const rowKey = String(getRowKey ? getRowKey(item) : i);
                  const expandedColIndex = expandedCells[rowKey];
                  const rowHref = getRowHref ? getRowHref(item) : undefined;
                  return (
                    <React.Fragment key={rowKey}>
                      <tr
                        className={cn(
                          "hover:bg-muted/30 transition-colors",
                          rowHref && "cursor-pointer"
                        )}
                        onClick={() => {
                          if (rowHref) router.push(rowHref);
                        }}
                      >
                        {columns.map((col, j) => {
                          const rawValue = item[col.accessorKey];

                          const formattedValue = col.valueFormatter
                            ? col.valueFormatter(rawValue)
                            : rawValue;

                          const comp = col.Cell
                            ? col.Cell({
                                ...item,
                                [col.accessorKey]: formattedValue
                              })
                            : String(formattedValue || "-");

                          const isActions = col.variant === "actions";

                          return (
                            <td
                              key={j}
                              onClick={(e) => {
                                if (isActions) {
                                  e.stopPropagation();
                                  return;
                                }
                                if (
                                  !col.renderExpanded ||
                                  !col.renderExpanded?.(item).Component ||
                                  !col.renderExpanded?.(item).enabled
                                )
                                  return;

                                setExpandedCells((prev) => ({
                                  ...prev,
                                  [rowKey]: prev[rowKey] === j ? undefined : j
                                }));
                              }}
                              className={cn(
                                "relative px-6 py-4 transition-colors",
                                col.cellClassName,
                                col.renderExpanded && "cursor-pointer",
                                expandedColIndex === j &&
                                  "bg-primary/10 border-primary/50 z-10 border border-b-0"
                              )}
                            >
                              {comp}
                              {expandedColIndex === j && (
                                <>
                                  {/* Masking strips bridge the bottom edge to hide the lower border */}
                                  <div className="bg-card absolute right-0 -bottom-px left-0 z-10 h-0.5" />
                                  <div className="bg-primary/10 absolute right-0 -bottom-px left-0 z-10 h-0.5" />
                                </>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      {expandedColIndex !== undefined &&
                        columns[expandedColIndex].renderExpanded && (
                          <tr className="bg-muted/10 border-t-0">
                            <td
                              colSpan={columns.length}
                              className="relative p-0"
                            >
                              <div className="bg-primary/10 border-primary/50 -mt-px border p-4">
                                {
                                  columns[expandedColIndex].renderExpanded(item)
                                    .Component
                                }
                              </div>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 shrink-0">
            <DataTablePagination
              page={Number(currentPage)}
              totalPages={totalPages}
              limit={Number(currentLimit)}
              totalResults={totalResults}
              onPageChange={handlePageChange}
              onLimitChange={(limit) => handleLimitChange(limit.toString())}
            />
          </div>
        </div>
      )}

      {showPaginationWhileLoading && (
        <div className="mx-auto w-full px-6 pb-6">
          <div className="mt-4 shrink-0">
            <DataTablePagination
              page={Number(currentPage)}
              totalPages={Number(stableTotalPages)}
              limit={Number(currentLimit)}
              totalResults={Number(stableTotalResults)}
              onPageChange={handlePageChange}
              onLimitChange={(limit) => handleLimitChange(limit.toString())}
            />
          </div>
        </div>
      )}
    </section>
  );
}
