import { useSearchParams } from "next/navigation";
import { PAGINATION } from "@/lib/constant";

function getSingleParam(searchParams: URLSearchParams, key: string) {
  const values = searchParams.getAll(key);
  return values.length === 1 ? values[0] : undefined;
}

export function usePaginationQuery() {
  const searchParams = useSearchParams();
  const allParams = Object.fromEntries(searchParams.entries());

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

  const search = searchValue ?? "";

  const sort = allParams.sort ?? PAGINATION.DEFAULT_SORT;

  return {
    ...allParams,
    search: search.trim(),
    page: String(page),
    limit: String(limit),
    sort: sort.trim()
  };
}
