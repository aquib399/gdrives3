import { Filter } from "@/types/filter-config";

export type QueryParams = Record<string, string>;

export function removeEmptyParams(params: QueryParams): QueryParams {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value.trim() !== "")
  );
}

export function toSearchParams(params: QueryParams) {
  return new URLSearchParams(removeEmptyParams(params));
}

export function buildQueryString(params?: Record<string, string>) {
  return toSearchParams(params || {}).toString();
}

export function buildQueryParams(
  filters: Filter[],
  baseParams: QueryParams = {}
): QueryParams {
  const params: QueryParams = { ...baseParams };

  for (const filter of filters) {
    let { field, operator, value } = filter;
    if (!operator) {
      operator = "equals";
    }
    if (
      (value === undefined || value === null || value === "") &&
      operator !== "empty" &&
      operator !== "not_empty"
    ) {
      continue;
    }

    let key: string;

    if (operator == "equals") {
      key = `${field}`;
    } else {
      key = `${field}__${operator}`;
    }

    const normalizedValue = Array.isArray(value) ? value.join(",") : String(value);

    if (normalizedValue.trim() !== "") {
      params[key] = normalizedValue;
    }
  }

  return removeEmptyParams(params);
}
