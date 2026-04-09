import type { Config } from "drizzle-kit";

const config: Config = {
  schema: "./src/db/schema.ts",  // path to your schema
  out: "./drizzle",           // folder for generated migration files
};

export default config;