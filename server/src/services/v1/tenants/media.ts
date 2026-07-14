import { Media, IMedia, MediaUploadingStatus } from "@/models/mongo/media.js";
import { createPaginationFromAggregate } from "@/utils/pagination.js";
import type * as validation from "@/validations/v1/tenant/media.js";
import { cacheClient, cacheNameSpace } from "@/clients/index.js";
import { GDrive, type IGDrive } from "@/models/mongo/gdrive.js";
import { buildMongoPipeline } from "@/utils/mongo/pipeline.js";
import { ListOptions } from "@/utils/query/list-option.js";
import { PaginatedResponse } from "@/types/pagination.js";
import { ApiKey, type IApiKey } from "@/models/index.js";
import { SchemaConfig } from "@/types/filter-config.js";
import { googleClient } from "@/clients/google.js";
import { buildCacheKey } from "@/utils/cache.js";
import {
  createErrorResponse,
  createSuccessResponse
} from "@/utils/response.js";
import { Types } from "mongoose";

const RESOURCE = "media";

async function invalidateMediaCache(id?: string | Types.ObjectId) {
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

export async function invalidateMediaAfterWrite(
  id?: string | Types.ObjectId
): Promise<void> {
  await invalidateMediaCache(id);
}

export type ListMediaPayload = {
  tenantId: string;
  config: SchemaConfig<IMedia>;
  listOptions: ListOptions;
};
export type ListMediaResponse = PaginatedResponse<IMedia>;

export const listMedia: serviceFunction<
  ListMediaPayload,
  ListMediaResponse
> = async ({ tenantId, config, listOptions }) => {
  const key = buildCacheKey({
    resource: RESOURCE,
    identifier: tenantId,
    query: listOptions
  });

  const paginatedResult = await cacheClient.get({
    key,
    query: async () => {
      const pipeline = buildMongoPipeline({
        config,
        listOptions,
        prePipeline: [{ $match: { tenantId: new Types.ObjectId(tenantId) } }]
      });
      const result = await Media.aggregate(pipeline);
      return createPaginationFromAggregate<IMedia>(
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
      "Media listed successfully",
      paginatedResult
    )
  };
};

export type GetMediaPayload = { id: string; tenantId: string };
export type GetMediaResponse = { media: IMedia };

export const getMedia: serviceFunction<
  GetMediaPayload,
  GetMediaResponse
> = async ({ id, tenantId }) => {
  const key = buildCacheKey({ resource: RESOURCE, identifier: id });

  const media = await cacheClient.get({
    key,
    query: async () => {
      const doc = await Media.findOne({ _id: id, tenantId }).lean();
      return doc ?? null;
    },
    config: {
      shouldCache: (val) => val !== null
    }
  });

  if (!media) {
    return {
      status: 404,
      response: createErrorResponse("Media not found", null)
    };
  }

  return {
    status: 200,
    response: createSuccessResponse("Media fetched successfully", { media })
  };
};

export type UpdateMediaPayload = {
  id: string;
  tenantId: string;
  data: validation.UpdateMediaPayload;
};
export type UpdateMediaResponse = { media: IMedia };

export const updateMedia: serviceFunction<
  UpdateMediaPayload,
  UpdateMediaResponse
> = async ({ id, tenantId, data }) => {
  const updateData: Record<string, any> = {};
  if (data.fileName !== undefined) updateData.fileName = data.fileName.trim();

  const media = await Media.findOneAndUpdate(
    { _id: id, tenantId },
    { $set: updateData },
    { returnDocument: "after", runValidators: true }
  ).lean();

  if (!media) {
    return {
      status: 404,
      response: createErrorResponse("Media not found", null)
    };
  }

  await invalidateMediaCache(media._id);

  return {
    status: 200,
    response: createSuccessResponse("Media updated successfully", { media })
  };
};

export type DeleteMediaPayload = { id: string; tenantId: string };
export type DeleteMediaResponse = { mediaId: string };

export const deleteMedia: serviceFunction<
  DeleteMediaPayload,
  DeleteMediaResponse
> = async ({ id, tenantId }) => {
  const media = await Media.findOne({ _id: id, tenantId }).lean();

  if (!media) {
    return {
      status: 404,
      response: createErrorResponse("Media not found", null)
    };
  }

  if (media.gdriveFileId) {
    try {
      const gDrive = await GDrive.findOne({ tenantId });
      if (gDrive) {
        const drive = googleClient.getTenantDriveClient({
          access_token: gDrive.accessToken,
          refresh_token: gDrive.refreshToken,
          expiry_date: gDrive.expiry
        });
        await drive.files.delete({ fileId: media.gdriveFileId });
      }
    } catch (error) {
      console.warn("Failed to delete remote media file:", error);
    }
  }

  await Media.findOneAndDelete({ _id: id, tenantId });
  await invalidateMediaCache(id);

  return {
    status: 200,
    response: createSuccessResponse("Media deleted successfully", {
      mediaId: id
    })
  };
};

type InitUploadPayload = {
  payload: validation.InitUploadPayload;
  tenantId: string;
  apiKey: string;
};

type InitUploadResponse = {
  uploadUrl: string;
  media: IMedia;
};

async function getOrCreateFolder(
  drive: any,
  folderName: string
): Promise<string> {
  const response = await drive.files.list({
    q: `name = '${folderName.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
    spaces: "drive"
  });

  const files = response.data.files || [];
  if (files.length > 0) {
    return files[0].id;
  }

  const fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder"
  };

  const folder = await drive.files.create({
    requestBody: fileMetadata,
    fields: "id"
  });

  return folder.data.id;
}

import { performance } from "node:perf_hooks";

export const initUpload: serviceFunction<
  InitUploadPayload,
  InitUploadResponse
> = async (props) => {
  // start performance
  const start = performance.now();
  let lastLap = start;
  const laps: Record<string, number> = {};

  const lap = (name: string) => {
    const now = performance.now();
    laps[name] = now - lastLap;
    lastLap = now;
  };

  const printPerformance = () => {
    const total = performance.now() - start;

    console.log("\n=== initUpload Performance ===");
    Object.entries(laps).forEach(([name, ms]) => {
      console.log(`${name.padEnd(25)} ${ms.toFixed(2)} ms`);
    });
    console.log(`${"Total".padEnd(25)} ${total.toFixed(2)} ms`);
    console.log("==============================\n");
  };

  const { payload, tenantId, apiKey } = props;

  // Run both DB lookups in parallel with caching
  const gDriveKey = buildCacheKey({ resource: "gdrive", identifier: tenantId });
  const apiKeyKey = buildCacheKey({
    resource: "api-key",
    identifier: `${tenantId}:${apiKey}`
  });

  const [gDrive, credential] = await Promise.all([
    cacheClient.get<IGDrive | null>({
      key: gDriveKey,
      query: async () => {
        const doc = await GDrive.findOne({ tenantId }).lean();
        return doc ?? null;
      },
      config: { shouldCache: (val) => val !== null, ttlSeconds: 600 }
    }),
    cacheClient.get<IApiKey | null>({
      key: apiKeyKey,
      query: async () => {
        const doc = await ApiKey.findOne({
          tenantId,
          key: apiKey,
          isActive: true
        }).lean();
        return doc ?? null;
      },
      config: { shouldCache: (val) => val !== null, ttlSeconds: 900 }
    })
  ]);

  // lap1
  lap("Find GDrive + API Key");

  if (!gDrive) {
    return {
      status: 400,
      response: createErrorResponse(
        "Google Drive not connected for this tenant",
        null
      )
    };
  }

  if (!credential) {
    return {
      status: 400,
      response: createErrorResponse("Invalid API key or secret", null)
    };
  }

  // Use pre-resolved folder ID from the API key (set at key creation time)
  const parents = credential.gDriveFolderId
    ? [credential.gDriveFolderId]
    : undefined;

  try {
    const authClient = googleClient.getTenantAuthClient({
      access_token: gDrive.accessToken,
      refresh_token: gDrive.refreshToken,
      expiry_date: gDrive.expiry ?? 0
    });

    // lap2
    lap("Create Auth Client");

    authClient.on("tokens", async (newTokens) => {
      await GDrive.findOneAndUpdate(
        { tenantId },
        {
          accessToken: newTokens.access_token,
          expiry: newTokens.expiry_date,
          ...(newTokens.refresh_token && {
            refreshToken: newTokens.refresh_token
          })
        }
      );

      // Invalidate cached GDrive credentials after token refresh
      void cacheClient.delete(gDriveKey);
    });

    const authHeaders = await authClient.getRequestHeaders();

    // lap3
    lap("Get Auth Headers");

    const headers = new Headers(authHeaders);
    headers.set("Content-Type", "application/json");
    headers.set("X-Upload-Content-Type", payload.mimeType);
    headers.set("X-Upload-Content-Length", payload.sizeInBytes.toString());

    const googleResponse = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: payload.fileName,
          ...(parents && { parents })
        })
      }
    );

    // lap4
    lap("Google Upload Init");

    const responseText = await googleResponse.text();
    const json = responseText ? JSON.parse(responseText) : null;
    const uploadUrl = googleResponse.headers.get("location");

    // lap5
    lap("Read Google Response");

    if (!googleResponse.ok) {
      throw new Error(
        `Google resumable upload init failed: ${googleResponse.status} ${googleResponse.statusText} ${JSON.stringify(json)}`
      );
    }

    if (!uploadUrl) {
      throw new Error("Location header missing from Google response");
    }

    const media = await Media.create({
      tenantId,
      fileName: payload.fileName,
      fullUrl: `https://drive.google.com/file/d/PENDING/preview`,
      previewUrl: `https://lh3.googleusercontent.com/d/PENDING`,
      mimeType: payload.mimeType,
      sizeInBytes: payload.sizeInBytes,
      uploadingStatus: MediaUploadingStatus.UPLOADING
    });

    // lap6
    lap("Create Media");

    void invalidateMediaAfterWrite(media._id);

    const response = createSuccessResponse("Media Upload Initialized", {
      uploadUrl,
      media: media.toObject()
    });

    // print all laps and total time
    printPerformance();

    return { status: 201, response };
  } catch (error: unknown) {
    printPerformance();
    console.error("Init Upload Error:", error);

    return {
      status: 500,
      response: createErrorResponse(
        "Failed to initialize Google Drive upload",
        null
      )
    };
  }
};

type CompleteUploadPayload = {
  payload: validation.CompleteUploadPayload;
  tenantId: string;
};

type CompleteUploadResponse = { media: IMedia };

export const completeUpload: serviceFunction<
  CompleteUploadPayload,
  CompleteUploadResponse
> = async (props) => {
  const { payload, tenantId } = props;
  const { mediaId, gdriveFileId } = payload;

  const mediaDoc = await Media.findOne({
    _id: mediaId,
    tenantId: tenantId,
    uploadingStatus: MediaUploadingStatus.UPLOADING
  });

  if (!mediaDoc) {
    return {
      status: 404,
      response: createErrorResponse("Media not found or already completed", {
        mediaId
      })
    };
  }

  try {
    const gDrive = await GDrive.findOne({ tenantId });
    if (gDrive) {
      const drive = googleClient.getTenantDriveClient(
        {
          access_token: gDrive.accessToken,
          refresh_token: gDrive.refreshToken,
          expiry_date: gDrive.expiry
        },
        async (newTokens) => {
          await GDrive.findOneAndUpdate(
            { tenantId },
            {
              accessToken: newTokens.access_token,
              expiry: newTokens.expiry_date,
              ...(newTokens.refresh_token && {
                refreshToken: newTokens.refresh_token
              })
            }
          );
        }
      );

      await drive.permissions.create({
        fileId: gdriveFileId,
        requestBody: {
          role: "reader",
          type: "anyone"
        }
      });
    }
  } catch (error) {
    console.error("Failed to make Google Drive file public:", error);
  }

  mediaDoc.gdriveFileId = gdriveFileId;
  mediaDoc.previewUrl = `https://lh3.googleusercontent.com/d/${gdriveFileId}`;
  mediaDoc.fullUrl = `https://drive.google.com/file/d/${gdriveFileId}/preview`;
  mediaDoc.uploadingStatus = MediaUploadingStatus.COMPLETED;

  await mediaDoc.save();
  void invalidateMediaAfterWrite(mediaDoc._id);

  const response = createSuccessResponse("Upload completed on Google Drive", {
    media: mediaDoc.toObject()
  });

  return { status: 200, response };
};
