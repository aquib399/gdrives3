import { validate } from "@/middlewares/validation.js";
import z from "zod";

const handleCallbackSchema = z.object({
  code: z.string(),
  state: z.string()
});
export type HandleCallbackPayload = z.infer<typeof handleCallbackSchema>;
export const handleCallback = validate(
  z.object({ query: handleCallbackSchema })
);
