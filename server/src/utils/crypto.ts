import { TOKEN_ENCRYPTION_KEY } from "@/configs/env.js";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = TOKEN_ENCRYPTION_KEY;

export function encryptToken(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY, "hex"),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}
