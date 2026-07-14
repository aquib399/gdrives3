import { cacheClient, cacheNameSpace } from "@/clients/index.js";
import { ApiKey, GDrive, type IApiKey } from "@/models/index.js";
import { buildCacheKey } from "@/utils/cache.js";
import { buildMongoPipeline } from "@/utils/mongo/pipeline.js";
import { createPaginationFromAggregate } from "@/utils/pagination.js";
import {
  createErrorResponse,
  createSuccessResponse
} from "@/utils/response.js";
import { SchemaConfig } from "@/types/filter-config.js";
import { ListOptions } from "@/utils/query/list-option.js";
import { PaginatedResponse } from "@/types/pagination.js";
import crypto from "crypto";
import { Types } from "mongoose";

const RESOURCE = "api-credentials";

async function invalidateApiCredentialCache(
  id?: string | Types.ObjectId
): Promise<void> {
  const tasks: Promise<void>[] = [];

  if (id) {
    tasks.push(
      cacheClient.delete(
        buildCacheKey({ resource: RESOURCE, identifier: String(id) })
      )
    );
  }

  tasks.push(cacheClient.deleteByPattern(`${cacheNameSpace}:${RESOURCE}:*`));
  await Promise.allSettled(tasks);
}

export type ListApiCredentialsPayload = {
  config: SchemaConfig<IApiKey>;
  listOptions: ListOptions;
};
export type ListApiCredentialsResponse = PaginatedResponse<IApiKey>;

export const listApiCredentials: serviceFunction<
  ListApiCredentialsPayload,
  ListApiCredentialsResponse
> = async ({ config, listOptions }) => {
  const key = buildCacheKey({ resource: RESOURCE, query: listOptions });

  const paginatedResult = await cacheClient.get({
    key,
    query: async () => {
      const pipeline = buildMongoPipeline({ config, listOptions });
      const result = await ApiKey.aggregate(pipeline);
      return createPaginationFromAggregate<IApiKey>(
        result,
        listOptions.pagination.page,
        listOptions.pagination.limit
      );
    },
    config: {
      shouldCache: (val) => val !== null
    }
  });

  return {
    status: 200,
    response: createSuccessResponse(
      "API credentials listed successfully",
      paginatedResult
    )
  };
};

export type GetApiCredentialPayload = { id: string };
export type GetApiCredentialResponse = { apiKey: IApiKey };

export const getApiCredential: serviceFunction<
  GetApiCredentialPayload,
  GetApiCredentialResponse
> = async ({ id }) => {
  const key = buildCacheKey({ resource: RESOURCE, identifier: id });
  const apiKey = await cacheClient.get({
    key,
    query: async () => {
      const doc = await ApiKey.findById(id).lean();
      return doc ?? null;
    },
    config: {
      shouldCache: (val) => val !== null
    }
  });

  if (!apiKey) {
    return {
      status: 404,
      response: createErrorResponse("API credential not found", null)
    };
  }

  return {
    status: 200,
    response: createSuccessResponse("API credential fetched successfully", {
      apiKey
    })
  };
};

export type CreateApiCredentialPayload = {
  tenantId: string;
  data: { name: string; folderName: string };
};
export type CreateApiCredentialResponse = { apiKey: IApiKey };

export const createApiCredential: serviceFunction<
  CreateApiCredentialPayload,
  CreateApiCredentialResponse
> = async ({ tenantId, data }) => {
  const gDrive = await GDrive.exists({ tenantId });
  if (!gDrive) {
    return {
      status: 400,
      response: createErrorResponse("Google Drive is not connected", null)
    };
  }

  const name = data.name.trim();
  const folderName = data.folderName.trim();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const apiKey = new ApiKey({
      tenantId,
      name,
      folderName,
      key: `sk_${crypto.randomBytes(16).toString("hex")}`,
      isActive: true
    });

    try {
      await apiKey.save();
      void invalidateApiCredentialCache(apiKey._id);
      return {
        status: 201,
        response: createSuccessResponse("API credential created successfully", {
          apiKey: apiKey.toObject()
        })
      };
    } catch (error: any) {
      if (error?.code !== 11000 || attempt === 2) {
        throw error;
      }
    }
  }

  return {
    status: 500,
    response: createErrorResponse("Failed to create API credential", null)
  };
};

export type UpdateApiCredentialPayload = {
  id: string;
  data: { name?: string; folderName?: string; isActive?: boolean };
};
export type UpdateApiCredentialResponse = { apiKey: IApiKey };

export const updateApiCredential: serviceFunction<
  UpdateApiCredentialPayload,
  UpdateApiCredentialResponse
> = async ({ id, data }) => {
  const updateData = {
    ...(data.name !== undefined ? { name: data.name.trim() } : {}),
    ...(data.folderName !== undefined
      ? { folderName: data.folderName.trim() }
      : {}),
    ...(data.isActive !== undefined ? { isActive: data.isActive } : {})
  };

  const apiKey = await ApiKey.findByIdAndUpdate(
    id,
    { $set: updateData },
    { returnDocument: "after", runValidators: true }
  ).lean();

  if (!apiKey) {
    return {
      status: 404,
      response: createErrorResponse("API credential not found", null)
    };
  }

  await invalidateApiCredentialCache(apiKey._id);

  return {
    status: 200,
    response: createSuccessResponse("API credential updated successfully", {
      apiKey
    })
  };
};

export type DeleteApiCredentialPayload = { id: string };
export type DeleteApiCredentialResponse = { apiKeyId: string };

export const deleteApiCredential: serviceFunction<
  DeleteApiCredentialPayload,
  DeleteApiCredentialResponse
> = async ({ id }) => {
  const apiKey = await ApiKey.findByIdAndDelete(id).lean();

  if (!apiKey) {
    return {
      status: 404,
      response: createErrorResponse("API credential not found", null)
    };
  }

  await invalidateApiCredentialCache(id);

  return {
    status: 200,
    response: createSuccessResponse("API credential deleted successfully", {
      apiKeyId: id
    })
  };
};
