const isLocalhost =
  typeof window !== "undefined" && window.location.protocol === "http:";

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const API_BASE_URL = isLocalhost
  ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL!
  : process.env.NEXT_PUBLIC_PROD_API_BASE_URL!;

console.log("API_BASE_URL", API_BASE_URL);
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
  DEFAULT_SORT: "createdAt"
};

export const MINIMUM_FILE_SIZE_BYTES = 1 * 1024; // 1 KB
export const MAXIMUM_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB
