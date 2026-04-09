import "dotenv/config";


import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";
import { Pool } from "pg";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({
    client: pool,
    schema,
});