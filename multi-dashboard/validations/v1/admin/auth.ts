import { credentialsSchema, phoneSchema } from "@/validations/base";
import z from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});
export type SignInPayload = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  details: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email()
  }),
  credentials: credentialsSchema
});

export type SignUpPayload = z.infer<typeof signUpSchema>;
