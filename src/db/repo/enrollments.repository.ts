import { and, eq } from "drizzle-orm";

import { db } from "../db.js";
import { enrollmentsTable } from "../schemas.js";
import type { Enrollment, NewEnrollment } from "../../types.js";

export async function createEnrollment(data: NewEnrollment): Promise<Enrollment[]> {
  const payload = { ...data, id: data.id ?? crypto.randomUUID() };
  const rows = await db.insert(enrollmentsTable).values(payload).returning();
  return rows;
}

export async function findEnrollmentById(
  id: string,
): Promise<Enrollment | undefined> {
  return db.query.enrollmentsTable.findFirst({
    where: eq(enrollmentsTable.id, id),
  });
}

export async function findEnrollmentByStudentAndCourse(
  studentId: string,
  courseId: string,
): Promise<Enrollment | undefined> {
  return db.query.enrollmentsTable.findFirst({
    where: and(
      eq(enrollmentsTable.studentId, studentId),
      eq(enrollmentsTable.courseId, courseId),
    ),
  });
}

export async function listEnrollmentsByStudentId(
  studentId: string,
): Promise<Enrollment[]> {
  return db.query.enrollmentsTable.findMany({
    where: eq(enrollmentsTable.studentId, studentId),
  });
}

export async function deleteEnrollment(id: string): Promise<Enrollment | undefined> {
  const [row] = await db.delete(enrollmentsTable).where(eq(enrollmentsTable.id, id)).returning();
  return row;
}
