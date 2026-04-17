import { zValidator } from "@hono/zod-validator";
import { ValidationTargets } from "hono";
import { ZodSchema } from "zod";

export const zvalidateWithThrow = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
) => {
  return zValidator(target, schema, (result) => {
    if (!result.success) {
      // Automatically throw the ZodError to be caught by app.onError
      throw result.error;
    }
  });
};
