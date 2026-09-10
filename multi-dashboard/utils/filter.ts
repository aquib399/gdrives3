import { Filter } from "@/types/filter-config";

export function buildQueryString(params?: Record<string, string>) {
  return Object.entries(params || {})
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

export function buildQueryParams(
  filters: Filter[],
  baseParams: Record<string, string> = {}
): Record<string, string> {
  const params: Record<string, string> = { ...baseParams };

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

    params[key] = Array.isArray(value) ? value.join(",") : String(value);
  }

  return params;
}
