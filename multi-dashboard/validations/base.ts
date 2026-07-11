import { MFAType } from "@/types/domain/credential";
import { phoneRegex } from "@/configs/index";
import z from "zod";

export function checkObjectId(id: unknown): boolean {
  return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}

export const objectIdSchema = z.string().refine((val) => checkObjectId(val), {
  message: "Invalid ObjectId"
});

export const otpSchema = z
  .string()
  .length(6)
  .regex(/^\d{6}$/, "OTP code must be a 6-digit number");

export const credentialsSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    mfaType: z.enum(MFAType).optional().default(MFAType.None)
  })
  .strict();

export const phoneSchema = z
  .string()
  .regex(phoneRegex, "Invalid phone number format");
