import { NODE_ENV, ORIGINS } from "@/configs/env.js";

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
  DEFAULT_SORT: "createdAt"
};
export const IS_PRODUCTION = NODE_ENV === "production";
export const CORS_ORIGINS = IS_PRODUCTION ? ORIGINS : true;


export const DEFAULT_HEARTBEAT_INTERVAL_MS = 1_000; // 10 seconds

export const MINIMUM_FILE_SIZE_BYTES = 1 * 1024; // 1 KB
export const MAXIMUM_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

// cache
export const MAXIMUM_IN_MEMORY_CACHE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const DEFAULT_TTL_SECONDS = 300;
