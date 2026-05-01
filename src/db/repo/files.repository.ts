import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { filesTable } from "../schemas.js";
import type { File, NewFile } from "../../types.js";

export async function createFile(data: NewFile): Promise<File[]> {
  const payload = { ...data, id: data.id ?? crypto.randomUUID() };
  const rows = await db.insert(filesTable).values(payload).returning();
  return rows;
}

export async function findFileById(id: string): Promise<File | undefined> {
  return db.query.filesTable.findFirst({
    where: eq(filesTable.id, id),
  });
}

export async function findFileByKey(key: string): Promise<File | undefined> {
  return db.query.filesTable.findFirst({
    where: eq(filesTable.key, key),
  });
}
