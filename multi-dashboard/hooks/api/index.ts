"use client";
import { PaginatedResponse } from "@/types/pagination";
import { InfiniteData } from "@tanstack/react-query";
import { ApiFunctionProps, ApiResponse, HookProps } from "@/types/api";

export type PaginatedApiResponse<T> = ApiResponse<PaginatedResponse<T>>;

export const getNextPageParam = <T>(
  lastPage: ApiResponse<PaginatedResponse<T>>
) => {
  return lastPage?.data?.next ?? undefined;
};

export const mergeInfinitePaginatedResponse = <T>(
  data: InfiniteData<PaginatedApiResponse<T>>
): PaginatedApiResponse<T> => {
  const pages = data?.pages ?? [];

  if (pages.length === 0) {
    return {
      error: false,
      message: "",
      data: {
        page: 1,
        totalPages: 1,
        limit: 0,
        totalResults: 0,
        next: null,
        previous: null,
        results: []
      }
    };
  }

  const lastPage = pages[pages.length - 1];
  const lastPageData = lastPage.data ?? {};
  const mergedResults = pages.flatMap((page) => page.data?.results ?? []);

  return {
    ...lastPage,
    data: {
      page: lastPageData.page ?? 1,
      totalPages: lastPageData.totalPages ?? 1,
      limit: lastPageData.limit ?? 0,
      totalResults: lastPageData.totalResults ?? 0,
      next: lastPageData.next ?? null,
      previous: lastPageData.previous ?? null,
      ...lastPageData,
      results: mergedResults
    }
  };
};

type InferPayload<T> = T extends (...args: any) => any
  ? Parameters<T>[0] extends { payload: infer P }
    ? P
    : void
  : T;

interface BuildApiFunctionPropsArgs<T> {
  props: HookProps<T>;
  pageParam?: number;
}

export const buildApiFunctionProps = <T>(
  parms: BuildApiFunctionPropsArgs<T>
): ApiFunctionProps<InferPayload<T>> => {
  const { props, pageParam } = parms;
  return {
    ...props,
    queryParams: {
      ...props?.queryParams,
      ...(pageParam ? { page: String(pageParam) } : {})
    }
  } as ApiFunctionProps<InferPayload<T>>;
};
