import type { UpdateProfilePayload } from "@/validations/v1/tenant/index.js";
import { ITenant, Tenant } from "@/models/index.js";
import { GDrive } from "@/models/mongo/gdrive.js";
import { cacheClient } from "@/clients/index.js";
import { buildCacheKey } from "@/utils/cache.js";
import {
  RESOURCE,
  invalidateTenantCache
} from "@/services/v1/shared/tenant/index.js";
import {
  createErrorResponse,
  createSuccessResponse
} from "@/utils/response.js";

interface GetProfileResponse {
  tenant: ITenant;
  driveConnected: boolean;
}

export const getProfile: serviceFunction<
  { id: string },
  GetProfileResponse
> = async ({ id }) => {
  const key = buildCacheKey({
    resource: RESOURCE,
    identifier: `${id}:profile`
  });

  const { driveConnected, tenant } = await cacheClient.get({
    key,
    query: async () => {
      const [tenant, driveConnected] = await Promise.all([
        Tenant.findById(id).lean(),
        GDrive.exists({ tenantId: id }).lean()
      ]);
      return { tenant, driveConnected: Boolean(driveConnected) };
    },
    config: {
      shouldCache: (val) => val !== null
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
    response: createSuccessResponse<GetProfileResponse>(
      "Tenant profile fetched successfully",
      {
        tenant,
        driveConnected
      }
    )
  };
};

interface UpdateProfileResponse {
  tenant: ITenant;
}

export const updateProfile: serviceFunction<
  { id: string; data: UpdateProfilePayload },
  UpdateProfileResponse
> = async ({ id, data }) => {
  const { ...updateData } = data;

  const tenant = await Tenant.findByIdAndUpdate(
    id,
    { $set: updateData },
    { returnDocument: "after", runValidators: true }
  )
    .populate("subscriptionId logoId")
    .lean();
  if (!tenant)
    return {
      status: 404,
      response: createErrorResponse("Tenant not found", null)
    };

  void invalidateTenantCache(tenant._id);
  return {
    status: 200,
    response: createSuccessResponse<UpdateProfileResponse>(
      "Tenant profile updated successfully",
      { tenant: tenant }
    )
  };
};
