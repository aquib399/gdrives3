import { objectIdSchema } from "@/validations/base.js";
import { validate } from "@/middlewares/validation.js";
import z from "zod";

const createApiCredentialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  folderName: z.string().min(1, "Folder name is required")
});
export type CreateApiCredentialPayload = z.infer<
  typeof createApiCredentialSchema
>;
export const createApiCredential = validate(
  z.object({ body: createApiCredentialSchema.strict() })
);

const updateApiCredentialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  folderName: z.string().min(1, "Folder name is required").optional(),
  isActive: z.boolean().optional()
});
export type UpdateApiCredentialPayload = z.infer<
  typeof updateApiCredentialSchema
>;
export const updateApiCredential = validate(
  z.object({
    body: updateApiCredentialSchema.strict(),
    params: z.object({ id: objectIdSchema })
  })
);
