import { useSearchParams } from "next/navigation";
import { PAGINATION } from "@/lib/constant";

export interface PaginationQuery {
  [key: string]: string;
  search: string;
  page: string;
  limit: string;
  sort: string;
}

function getSingleParam(searchParams: URLSearchParams, key: string) {
  const values = searchParams.getAll(key);
  return values.length === 1 ? values[0] : undefined;
}

export function usePaginationQuery() {
  const searchParams = useSearchParams();
  const allParams: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    if (value.trim() !== "") {
      allParams[key] = value.trim();
    }
  }

  const pageValue = getSingleParam(searchParams, "page");
  const limitValue = getSingleParam(searchParams, "limit");
  const searchValue = getSingleParam(searchParams, "search");

  const page = Math.max(1, Number.parseInt(pageValue ?? "", 10) || 1);

  const parsedLimit =
    Number.parseInt(limitValue ?? "", 10) || PAGINATION.DEFAULT_LIMIT;
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(PAGINATION.MIN_LIMIT, parsedLimit)
  );

  const search = searchValue?.trim() ?? "";

  const sort = allParams.sort || PAGINATION.DEFAULT_SORT;

  return {
    ...allParams,
    search,
    page: String(page),
    limit: String(limit),
    sort: sort.trim()
  } satisfies PaginationQuery;
}
