import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { courses } from "../schema.js";
export async function createCourse(data) {
    const [row] = await db.insert(courses).values(data).returning();
    return row;
}
export async function findCourseById(id) {
    return db.query.courses.findFirst({
        where: eq(courses.id, id),
    });
}
export async function listCoursesByTeacherId(teacherId) {
    return db.query.courses.findMany({
        where: eq(courses.teacherId, teacherId),
    });
}
