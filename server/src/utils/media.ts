import { IS_PRODUCTION } from "@/lib/constant.js";
import * as crypto from "crypto";

const bucket = "BUCKET_NAME";
const cloudfrontDomain = "CLOUDFRONT_DOMAIN";
const partSize = 1000;

export interface S3UploadResult {
  media: {
    fileName: string;
    fullUrl: string;
    mimeType: string;
    sizeInBytes: number;
  };
  message: string;
}

const uploadPaths = {
  developement: "trexind/dev",
  production: "trexind/prod"
};

const uploadPath = IS_PRODUCTION
  ? uploadPaths.production
  : uploadPaths.developement;

export interface InitUploadProps {
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
}

export interface MultipartUploadResult {
  uploadId: string;
  key: string;
  partSize: number;
  urls: string[];
}
export async function initMultipartUpload(
  props: InitUploadProps
): Promise<MultipartUploadResult> {
  const { fileName, mimeType, sizeInBytes } = props;

  const partsCount = Math.ceil(sizeInBytes / partSize);

  const safeName: string = generateSafeName({ fileName, mimeType });
  const key = `${uploadPath}/${safeName}`;

  const uploadId = "";

  const urls: string[] = [];
  return {
    uploadId,
    key,
    partSize,
    urls
  };
}

export async function generatePresignedPutUrl(
  fileName: string,
  mimeType: string
): Promise<{ presignedUrl: string; key: string; fullUrl: string }> {
  const safeName = generateSafeName({ fileName, mimeType });
  const key = `${uploadPath}/${safeName}`;

  const presignedUrl = "";
  const fullUrl = "";
  return { presignedUrl, key, fullUrl };
}

export async function uploadBuffer({
  buffer,
  fileName,
  mimeType
}: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
}): Promise<{ key: string; fullUrl: string }> {
  const key = "";
  const fullUrl = "";
  return {
    key,
    fullUrl
  };
}

export async function completeMultipartUpload(
  key: string,
  uploadId: string,
  parts: { ETag: string; PartNumber: number }[]
) {}

function generateSafeName({
  fileName,
  mimeType
}: {
  fileName: string;
  mimeType: string;
}) {
  const safe = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9.-]/g, "_");

  const extension =
    mimeType.split("/")[1]?.split("+")[0] || fileName.split(".").pop() || "bin";

  const randomHex = crypto.randomBytes(8).toString("hex");

  return `${safe}_${randomHex}_.${extension}`;
}
