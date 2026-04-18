import "dotenv/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schemas.ts";
import { Pool } from "pg"
import { seed } from "drizzle-seed";


console.log("DATABASE_URL:", process.env.DATABASE_URL);

const sql = new Pool({ connectionString: process.env.DATABASE_URL });

export type Database = NodePgDatabase<typeof schema>
export const db: Database = drizzle({
    client: sql,
    schema: { ...schema },
});

// await seed(db, schema, { count: 100 });
