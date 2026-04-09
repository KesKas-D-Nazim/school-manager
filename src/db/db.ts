// i changed this because it needs to be connected to a cloud database and since i didn't connect it yet

// import { drizzle } from "drizzle-orm/libsql";
// import * as schema from "./schema.js";

// export const db = drizzle({
//   connection: {
//     url: process.env.DATABASE_URL ?? "",
//     authToken: process.env.DATABASE_AUTH_TOKEN,
//   },
//   schema,
// });


// this just a temporary file to avoid errors until we connect to the cloud database

// import Database from "better-sqlite3";
// const sqlite = new Database("db.sqlite");
// export const db = drizzle(sqlite, { schema });
import "dotenv/config";


import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

export const db = drizzle({
    connection: process.env.DATABASE_URL ?? "",
    schema,
});