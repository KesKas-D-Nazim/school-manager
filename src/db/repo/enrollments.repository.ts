// import { and, eq } from "drizzle-orm";

// import { db } from "../db.js";
// import { enrollmentsTable } from "../schemas.js";
// import type { Enrollment, NewEnrollment } from "../../types.js";

// export async function createEnrollment(data: NewEnrollment): Promise<Enrollment> {
//   const [row] = await db.insert(enrollmentsTable).values(data).returning();
//   return row;
// }

// export async function findEnrollmentById(
//   id: string,
// ): Promise<Enrollment | undefined> {
//   return db.query.enrollmentsTable.findFirst({
//     where: eq(enrollmentsTable.id, id),
//   });
// }

// export async function findEnrollmentByStudentAndCourse(
//   studentId: string,
//   courseId: string,
// ): Promise<Enrollment | undefined> {
//   return db.query.enrollmentsTable.findFirst({
//     where: and(
//       eq(enrollmentsTable.studentId, studentId),
//       eq(enrollmentsTable.courseId, courseId),
//     ),
//   });
// }

// export async function listEnrollmentsByStudentId(
//   studentId: string,
// ): Promise<Enrollment[]> {
//   return db.query.enrollmentsTable.findMany({
//     where: eq(enrollmentsTable.studentId, studentId),
//   });
// }

// export async function deleteEnrollment(id: string): Promise<void> {
//   await db.delete(enrollmentsTable).where(eq(enrollmentsTable.id, id));
// }
