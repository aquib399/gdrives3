import { useSearchParams } from "next/navigation";
import { PAGINATION } from "@/lib/constant";

export function usePaginationQuery() {
  const searchParams = useSearchParams();

  const allParams = Object.fromEntries(searchParams.entries());

  const pageValues = searchParams.getAll("page");
  const limitValues = searchParams.getAll("limit");
  const searchValues = searchParams.getAll("search");

  const page =
    pageValues.length === 1
      ? Math.max(1, Number.parseInt(pageValues[0], 10) || 1)
      : 1;

  const limit =
    limitValues.length === 1
      ? Math.min(
          PAGINATION.MAX_LIMIT,
          Math.max(
            PAGINATION.MIN_LIMIT,
            Number.parseInt(limitValues[0], 10) || PAGINATION.DEFAULT_LIMIT
          )
        )
      : PAGINATION.DEFAULT_LIMIT;

  const search = searchValues.length === 1 ? searchValues[0] : "";

  const sort = allParams.sort ?? PAGINATION.DEFAULT_SORT;

  return {
    ...allParams,
    search: search.trim(),
    page: String(page),
    limit: String(limit),
    sort: sort.trim()
  };
}
