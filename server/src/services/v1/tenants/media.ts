import { Media, IMedia, MediaUploadingStatus } from "@/models/mongo/media.js";
import type * as validation from "@/validations/v1/tenant/media.js";
import {
  createErrorResponse,
  createSuccessResponse
} from "@/utils/response.js";
import {
  initMultipartUpload,
  MultipartUploadResult,
  completeMultipartUpload
} from "@/utils/media.js";

type InitUploadPayload = {
  payload: validation.InitUploadPayload;
  tenantId: string;
};
type InitUploadResponse = {
  config: MultipartUploadResult;
  media: IMedia;
};

export const initUpload: serviceFunction<
  InitUploadPayload,
  InitUploadResponse
> = async (props) => {
  const { payload, tenantId } = props;

  const data = await initMultipartUpload({
    fileName: payload.fileName,
    mimeType: payload.mimeType,
    sizeInBytes: payload.sizeInBytes
  });

  const media = await Media.create({
    fileName: payload.fileName,
    // fullUrl: `https://${AWS_CONFIG.CLOUDFRONT_DOMAIN}/${data.key}`,
    mimeType: payload.mimeType,
    sizeInBytes: payload.sizeInBytes,
    tenantId,
    uploadingStatus: MediaUploadingStatus.UPLOADING
  });

  const enrichedData: InitUploadResponse = {
    config: data,
    media: media.toObject()
  };

  const response = createSuccessResponse(
    "Media Upload Initialized",
    enrichedData
  );

  return {
    status: 201,
    response: response
  };
};

type CompleteUploadPayload = {
  payload: validation.CompleteUploadPayload;
  tenantId: string;
};
type CompleteUploadResponse = IMedia;
export const completeUpload: serviceFunction<
  CompleteUploadPayload,
  CompleteUploadResponse
> = async (props) => {
  const { payload, tenantId } = props;
  const { mediaId, uploadId, parts } = payload;

  const mediaDoc = await Media.findOne({
    _id: mediaId,
    tenantId: tenantId,
    uploadingStatus: MediaUploadingStatus.UPLOADING
  });
  if (!mediaDoc) {
    const response = createErrorResponse("Media not found", { mediaId });
    return { status: 404, response };
  }
  // const key = mediaDoc.fullUrl.split(
  //   `https://${AWS_CONFIG.CLOUDFRONT_DOMAIN}/`
  // )[1];
  const key = "";
  await completeMultipartUpload(key, uploadId, parts);

  mediaDoc.uploadingStatus = MediaUploadingStatus.COMPLETED;
  await mediaDoc.save();
  const media = mediaDoc.toObject();

  const response = createSuccessResponse("Upload completed on S3", media);

  return { status: 200, response: response };
};
