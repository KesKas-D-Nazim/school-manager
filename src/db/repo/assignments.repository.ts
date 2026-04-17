// import { eq } from "drizzle-orm";

// import { db } from "../db.js";
// import { assignmentsTable } from "../schemas.js";
// import type { Assignment, NewAssignment } from "../../types.js";

// export async function createAssignment(data: NewAssignment): Promise<Assignment> {
//   const [row] = await db.insert(assignmentsTable).values(data).returning();
//   return row;
// }

// export async function findAssignmentById(
//   id: string,
// ): Promise<Assignment | undefined> {
//   return db.query.assignmentsTable.findFirst({
//     where: eq(assignmentsTable.id, id),
//   });
// }

// export async function listAssignmentsByCourseId(
//   courseId: string,
// ): Promise<Assignment[]> {
//   return db.query.assignmentsTable.findMany({
//     where: eq(assignmentsTable.courseId, courseId),
//   });
// }
