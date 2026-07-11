import { createPaginationFromAggregate } from "@/utils/pagination.js";
import { RESOURCE } from "@/services/v1/shared/tenant/index.js";
import { buildMongoPipeline } from "@/utils/mongo/pipeline.js";
import { ListOptions } from "@/utils/query/list-option.js";
import { PaginatedResponse } from "@/types/pagination.js";
import { SchemaConfig } from "@/types/filter-config.js";
import { Tenant, ITenant } from "@/models/index.js";
import { buildCacheKey } from "@/utils/cache.js";
import { cacheClient } from "@/clients/index.js";
import { PipelineStage } from "mongoose";
import {
  createErrorResponse,
  createSuccessResponse
} from "@/utils/response.js";

// ── Get ───────────────────────────────────────────────────────────────────────
export type GetBusinessPayload = { id: string };
export type GetBusinessResponse = { tenant: ITenant };

export const getTenant: serviceFunction<
  GetBusinessPayload,
  GetBusinessResponse
> = async ({ id }) => {
  const key = buildCacheKey({
    resource: RESOURCE,
    identifier: id
  });
  const tenant = await cacheClient.get({
    key,
    query: async () => {
      const doc = await Tenant.findById(id).lean();
      if (!doc) return null;
      return doc;
    },
    config: {
      shouldCache: (val) => val !== null // don't cache 404s
    }
  });

  if (!tenant) {
    return {
      status: 404,
      response: createErrorResponse("Tenant not found", null)
    };
  }

  return {
    status: 200,
    response: createSuccessResponse("Tenant fetched successfully", { tenant })
  };
};

// ── List ──────────────────────────────────────────────────────────────────────
export type ListTenantsPayload = {
  config: SchemaConfig<ITenant>;
  listOptions: ListOptions;
};
export type ListTenantsResponse = PaginatedResponse<ITenant>;

export const listTenants: serviceFunction<
  ListTenantsPayload,
  ListTenantsResponse
> = async ({ listOptions, config }) => {
  const key = buildCacheKey({
    resource: RESOURCE,
    query: listOptions
  });

  const prePipeline: PipelineStage[] = [];

  const paginatedResult = await cacheClient.get({
    key,
    query: async () => {
      const pipeline = buildMongoPipeline({ config, listOptions, prePipeline });
      const result = await Tenant.aggregate(pipeline);
      return createPaginationFromAggregate<ITenant>(
        result,
        listOptions.pagination.page,
        listOptions.pagination.limit
      );
    },
    config: {
      shouldCache: (val) => val !== null // don't cache 404s
    }
  });

  return {
    status: 200,
    response: createSuccessResponse(
      "Tenants listed successfully",
      paginatedResult
    )
  };
};
