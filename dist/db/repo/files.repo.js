import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { files } from "../schema.js";
export async function createFile(data) {
    const [row] = await db.insert(files).values(data).returning();
    return row;
}
export async function findFileById(id) {
    return db.query.files.findFirst({
        where: eq(files.id, id),
    });
}
export async function findFileByKey(key) {
    return db.query.files.findFirst({
        where: eq(files.key, key),
    });
}
