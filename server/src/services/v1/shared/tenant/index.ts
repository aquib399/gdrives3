import { cacheClient, cacheNameSpace } from "@/clients/index.js";
import { buildCacheKey } from "@/utils/cache.js";
import { Types } from "mongoose";

export const RESOURCE = "tenants";

export async function invalidateTenantCache(
  id?: string | Types.ObjectId
): Promise<void> {
  const tasks: Promise<void>[] = [];

  if (id) {
    const singleKey = buildCacheKey({
      resource: RESOURCE,
      identifier: String(id)
    });
    tasks.push(cacheClient.delete(singleKey));
  }

  // Wipe every list cache entry: "cacheNameSpace:tenants:*"
  tasks.push(cacheClient.deleteByPattern(`${cacheNameSpace}:${RESOURCE}:*`));

  await Promise.allSettled(tasks);
}
