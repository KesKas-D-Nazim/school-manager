import { and, eq } from "drizzle-orm";
import { db } from "../db.js";
import { enrollments } from "../schema.js";
export async function createEnrollment(data) {
    const [row] = await db.insert(enrollments).values(data).returning();
    return row;
}
export async function findEnrollmentById(id) {
    return db.query.enrollments.findFirst({
        where: eq(enrollments.id, id),
    });
}
export async function findEnrollmentByStudentAndCourse(studentId, courseId) {
    return db.query.enrollments.findFirst({
        where: and(eq(enrollments.studentId, studentId), eq(enrollments.courseId, courseId)),
    });
}
