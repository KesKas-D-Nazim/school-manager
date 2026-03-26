import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { assignments } from "../schema.js";
export async function createAssignment(data) {
    const [row] = await db.insert(assignments).values(data).returning();
    return row;
}
export async function findAssignmentById(id) {
    return db.query.assignments.findFirst({
        where: eq(assignments.id, id),
    });
}
export async function listAssignmentsByCourseId(courseId) {
    return db.query.assignments.findMany({
        where: eq(assignments.courseId, courseId),
    });
}
