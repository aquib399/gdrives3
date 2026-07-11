// validations/index.ts
// validations/index.ts
import type { ZodError } from "zod";

export function getZodErrors(error: ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const key = issue.path.join(".");
    if (!acc[key]) acc[key] = issue.message;
    return acc;
  }, {});
}
