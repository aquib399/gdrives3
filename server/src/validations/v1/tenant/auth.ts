import {
  credentialsSchema,
  objectIdSchema,
  otpSchema
} from "@/validations/base.js";
import { validate } from "@/middlewares/validation.js";
import z from "zod";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});
export type SignInPayload = z.infer<typeof signInSchema>;
export const signIn = validate(
  z.object({
    body: signInSchema.strict()
  })
);

const signUpSchema = z.object({
  details: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email(),
    otpRequestId: objectIdSchema,
    otpCode: otpSchema
  }),
  credentials: credentialsSchema
});

export type SignUpPayload = z.infer<typeof signUpSchema>;
export const signUp = validate(
  z.object({
    body: signUpSchema.strict()
  })
);

const sendSignupOtpSchema = z.object({
  email: z.email()
});
export type SendSignupOtpPayload = z.infer<typeof sendSignupOtpSchema>;
export const sendSignupOtp = validate(
  z.object({ body: sendSignupOtpSchema.strict() })
);
