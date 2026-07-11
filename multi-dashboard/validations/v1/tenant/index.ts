import { phoneSchema } from "@/validations/base.js";
import z from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: phoneSchema.optional()
});
export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
