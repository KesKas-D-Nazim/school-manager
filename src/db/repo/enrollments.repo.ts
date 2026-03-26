import { and, eq } from "drizzle-orm";

import { db } from "../db.js";
import { enrollments } from "../schema.js";
import type { Enrollment, NewEnrollment } from "../../types.js";

export async function createEnrollment(data: NewEnrollment): Promise<Enrollment> {
  const [row] = await db.insert(enrollments).values(data).returning();
  return row;
}

export async function findEnrollmentById(
  id: number,
): Promise<Enrollment | undefined> {
  const [row] = await db.select().from(enrollments).where(eq(enrollments.id, id));
  return row;
}

export async function findEnrollmentByStudentAndCourse(
  studentId: number,
  courseId: number,
): Promise<Enrollment | undefined> {
  const [row] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.studentId, studentId), eq(enrollments.courseId, courseId)));
  return row;
}
