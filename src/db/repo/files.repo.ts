import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { files } from "../schema.js";
import type { File, NewFile } from "../../types.js";

export async function createFile(data: NewFile): Promise<File> {
  const [row] = await db.insert(files).values(data).returning();
  return row;
}

export async function findFileById(id: number): Promise<File | undefined> {
  const [row] = await db.select().from(files).where(eq(files.id, id));
  return row;
}

export async function findFileByKey(key: string): Promise<File | undefined> {
  const [row] = await db.select().from(files).where(eq(files.key, key));
  return row;
}
