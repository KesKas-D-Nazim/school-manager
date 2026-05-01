import { eq } from "drizzle-orm";

import { db } from "../db.js";

import type { NewReference, Reference } from "../../types.js";
import { referencesTable } from "../schemas.js";

export async function createReference(data: NewReference): Promise<Reference[]> {
    const payload = { ...data, id: data.id ?? crypto.randomUUID() };
    const rows = await db.insert(referencesTable).values(payload).returning();
    return rows;
}

export async function findReferenceById(
    id: string,
): Promise<Reference | undefined> {
    return db.query.referencesTable.findFirst({
        where: eq(referencesTable.id, id),
    });
}

export async function listReferencesByCourseId(
    courseId: string,
): Promise<Reference[]> {
    return db.query.referencesTable.findMany({
        where: eq(referencesTable.courseId, courseId),
    });
}
