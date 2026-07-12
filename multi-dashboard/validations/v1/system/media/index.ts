import { objectIdSchema } from "@/validations/base.js";
import z from "zod";
import {
  MAXIMUM_FILE_SIZE_BYTES,
  MINIMUM_FILE_SIZE_BYTES
} from "@/lib/constant.js";

const initUploadSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  sizeInBytes: z
    .number()
    .positive()
    .min(MINIMUM_FILE_SIZE_BYTES)
    .max(MAXIMUM_FILE_SIZE_BYTES)
});

export type InitUploadPayload = z.infer<typeof initUploadSchema>;

const completeUploadSchema = z.object({
  mediaId: objectIdSchema,
  gdriveFileId: z.string().min(1)
});

export type CompleteUploadPayload = z.infer<typeof completeUploadSchema>;
