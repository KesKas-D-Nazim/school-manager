import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { references } from "../schema.js";
export async function createReference(data) {
    const [row] = await db.insert(references).values(data).returning();
    return row;
}
export async function findReferenceById(id) {
    return db.query.references.findFirst({
        where: eq(references.id, id),
    });
}
export async function listReferencesByCourseId(courseId) {
    return db.query.references.findMany({
        where: eq(references.courseId, courseId),
    });
}
