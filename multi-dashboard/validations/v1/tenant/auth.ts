import { credentialsSchema, phoneSchema, objectIdSchema, otpSchema } from "@/validations/base";
import z from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});
export type SignInPayload = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  details: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email(),
    phone: phoneSchema.optional(),
    otpRequestId: objectIdSchema,
    otpCode: otpSchema
  }),
  credentials: credentialsSchema
});

export type SignUpPayload = z.infer<typeof signUpSchema>;

const sendSignupOtpSchema = z.object({
  email: z.email()
});
export type SendSignupOtpPayload = z.infer<typeof sendSignupOtpSchema>;
