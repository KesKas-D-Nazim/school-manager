import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas.ts",
  out: "./drizzle",              // folder for generated migration files
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
});
