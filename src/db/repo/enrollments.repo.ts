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
  return db.query.enrollments.findFirst({
    where: eq(enrollments.id, id),
  });
}

export async function findEnrollmentByStudentAndCourse(
  studentId: number,
  courseId: number,
): Promise<Enrollment | undefined> {
  return db.query.enrollments.findFirst({
    where: and(
      eq(enrollments.studentId, studentId),
      eq(enrollments.courseId, courseId),
    ),
  });
}

export async function listEnrollmentsByStudentId(
  studentId: number,
): Promise<Enrollment[]> {
  return db.query.enrollments.findMany({
    where: eq(enrollments.studentId, studentId),
  });
}

export async function deleteEnrollment(id: number): Promise<void> {
  await db.delete(enrollments).where(eq(enrollments.id, id));
}
