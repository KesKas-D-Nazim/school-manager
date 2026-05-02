// For Node.js - make sure to install the 'ws' and 'bufferutil' packages
import "dotenv/config";
import * as schema from "./schemas.js";
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from "pg";

const sql = new Pool({ connectionString: process.env.DATABASE_URL });

export type Database = NodePgDatabase<typeof schema>
export const db: Database = drizzle({
    client: sql,
    schema: { ...schema },
});

// await seed(db, schema, { count: 100 });
