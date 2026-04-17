import { defineConfig } from "drizzle-kit";
import "dotenv/config";

console.log(process.env.DATABASE_URL)

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",  // path to your schema
  out: "./drizzle",              // folder for generated migration files
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
});
