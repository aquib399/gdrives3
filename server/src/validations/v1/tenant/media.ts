import { validate } from "@/middlewares/validation.js";
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

export const initUpload = validate(
  z.object({
    body: initUploadSchema.strict()
  })
);

const completeUploadSchema = z.object({
  mediaId: objectIdSchema,
  gdriveFileId: z.string().min(1)
});

export type CompleteUploadPayload = z.infer<typeof completeUploadSchema>;

export const completeUpload = validate(
  z.object({
    body: completeUploadSchema.strict()
  })
);

const updateMediaSchema = z.object({
  fileName: z.string().min(1).optional()
});

export type UpdateMediaPayload = z.infer<typeof updateMediaSchema>;

export const updateMedia = validate(
  z.object({
    params: z.object({ id: objectIdSchema }),
    body: updateMediaSchema.strict()
  })
);

export const singleMedia = validate(
  z.object({
    params: z.object({ id: objectIdSchema })
  })
);
