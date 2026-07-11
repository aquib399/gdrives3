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

  filters.forEach(({ field, operator, value }) => {
    if (!operator) {
      operator = "equals";
    }
    if (
      (value === undefined || value === null || value === "") &&
      operator !== "empty" &&
      operator !== "not_empty"
    ) {
      return;
    }

    let key: string;

    if (operator == "equals") {
      key = `${field}`;
    } else {
      key = `${field}__${operator}`;
    }

    params[key] = Array.isArray(value) ? value.join(",") : String(value);
  });

  return params;
}
