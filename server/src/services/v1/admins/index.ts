import type { UpdateProfilePayload } from "@/validations/v1/admin/index.js";
import { cacheClient, cacheNameSpace } from "@/clients/index.js";
import { Admin, IAdmin } from "@/models/index.js";
import { buildCacheKey } from "@/utils/cache.js";
import {
  createErrorResponse,
  createSuccessResponse
} from "@/utils/response.js";

export const RESOURCE = "admins";

export async function invalidateAdminCache(id?: string): Promise<void> {
  const tasks: Promise<void>[] = [];

  if (id) {
    const singleKey = buildCacheKey({ resource: RESOURCE, identifier: id });
    tasks.push(cacheClient.delete(singleKey));
  }

  tasks.push(cacheClient.deleteByPattern(`${cacheNameSpace}:${RESOURCE}:*`));

  await Promise.allSettled(tasks);
}

interface GetProfileResponse {
  admin: IAdmin;
}

export const getProfile: serviceFunction<
  { id: string },
  GetProfileResponse
> = async ({ id }) => {
  const key = buildCacheKey({ resource: RESOURCE, identifier: id });

  const admin = await cacheClient.get({
    key,
    query: async () => {
      const doc = await Admin.findById(id).lean();
      return doc ?? null;
    },
    config: {
      ttlSeconds: 300,
      shouldCache: (val) => val !== null
    }
  });

  if (!admin)
    return {
      status: 404,
      response: createErrorResponse("Admin not found", null)
    };

  return {
    status: 200,
    response: createSuccessResponse<GetProfileResponse>(
      "Admin profile fetched successfully",
      {
        admin: admin as unknown as IAdmin
      }
    )
  };
};

interface UpdateProfileResponse {
  admin: IAdmin;
}

export const updateProfile: serviceFunction<
  { id: string; data: UpdateProfilePayload },
  UpdateProfileResponse
> = async ({ id, data }) => {
  const admin = await Admin.findByIdAndUpdate(
    id,
    { $set: data },
    { returnDocument: "after", runValidators: true }
  );
  if (!admin)
    return {
      status: 404,
      response: createErrorResponse("Admin not found", null)
    };

  void invalidateAdminCache(id);

  return {
    status: 200,
    response: createSuccessResponse<UpdateProfileResponse>(
      "Admin profile updated successfully",
      { admin: admin.toObject() }
    )
  };
};
