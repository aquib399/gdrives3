"use client";
import { ApiFunctionProps, ApiRequestResult, HookProps } from "@/types/api";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { PaginatedApiResponse } from "@/hooks/api";
import { ColumnDef, ListingContent } from "../table-listing";
import { TableSkeleton } from "../table-skeleton";
import { useListing } from "@/hooks/useListing";
import { Filter } from "@/types/filter-config";

interface HOCListingConfig<T> {
  title: string;
  description: string;
  searchPlaceholder: string;
  columns: ColumnDef<T>[];
  initialFilters?: Filter[];
  schemaConfig?: any;
  HeaderUtils?: React.ReactNode;
  useFetchList: (
    props: HookProps<(props: ApiFunctionProps) => Promise<ApiRequestResult<T>>>
  ) => UseInfiniteQueryResult<PaginatedApiResponse<T>, Error>;

  getRowKey: (item: T) => string;
  getRowHref: (item: T) => string;
}

export function withListing<T>(config: HOCListingConfig<T>) {
  return function WithListingComponent(props: any) {
    const listConfig = useListing(config.initialFilters);

    const { data, isPending, refetch, isRefetching, error } =
      config.useFetchList({
        queryParams: listConfig.processedFilters
      });

    const results = data?.data?.results ?? [];
    const totalPages = data?.data?.totalPages ?? 1;
    const totalResults = data?.data?.totalResults ?? 0;

    return (
      <ListingContent
        title={config.title}
        description={config.description}
        searchPlaceholder={config.searchPlaceholder}
        data={results}
        isPending={isPending}
        columns={config.columns}
        totalPages={totalPages}
        isRefetching={isRefetching}
        error={error}
        refetch={refetch}
        totalResults={totalResults}
        HeaderUtils={config.HeaderUtils}
        getRowKey={config.getRowKey}
        getRowHref={config.getRowHref}
        skeleton={
          <TableSkeleton rowCount={8} columns={config.columns as any} />
        }
        updateFilters={listConfig.updateFilters}
        activeFilters={listConfig.activeFilters}
        schemaConfig={config.schemaConfig}
        {...props}
      />
    );
  };
}
