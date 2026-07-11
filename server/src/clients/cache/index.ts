import { CacheLayerClient } from "./client.js";
import { L1Tier } from "./l1.js";
import { L2Tier } from "./l2.js";

import {
  DEFAULT_TTL_SECONDS,
  MAXIMUM_IN_MEMORY_CACHE_SIZE_BYTES
} from "@/lib/constant.js";

const tiers = [
  new L1Tier({ maxSizeBytes: MAXIMUM_IN_MEMORY_CACHE_SIZE_BYTES }), // index 0
  new L2Tier({}) // index 1
  // new L3Tier({...}),  <- adding a tier is just one more line here
];

export const cacheNameSpace = "app";

export const cacheClient = new CacheLayerClient(cacheNameSpace, {
  tiers: tiers,
  defaultTtlSeconds: DEFAULT_TTL_SECONDS,
  defaultRefreshInBackground: false
});

export type { CacheGetOptions } from "./client.js";
