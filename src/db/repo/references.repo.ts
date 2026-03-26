import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { references } from "../schema.js";
import type { NewReference, Reference } from "../../types.js";

export async function createReference(data: NewReference): Promise<Reference> {
  const [row] = await db.insert(references).values(data).returning();
  return row;
}

export async function findReferenceById(
  id: number,
): Promise<Reference | undefined> {
  return db.query.references.findFirst({
    where: eq(references.id, id),
  });
}

export async function listReferencesByCourseId(
  courseId: number,
): Promise<Reference[]> {
  return db.query.references.findMany({
    where: eq(references.courseId, courseId),
  });
}
