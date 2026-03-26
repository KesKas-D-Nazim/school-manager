import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { assignments } from "../schema.js";
import type { Assignment, NewAssignment } from "../../types.js";

export async function createAssignment(data: NewAssignment): Promise<Assignment> {
  const [row] = await db.insert(assignments).values(data).returning();
  return row;
}

export async function findAssignmentById(
  id: number,
): Promise<Assignment | undefined> {
  return db.query.assignments.findFirst({
    where: eq(assignments.id, id),
  });
}

export async function listAssignmentsByCourseId(
  courseId: number,
): Promise<Assignment[]> {
  return db.query.assignments.findMany({
    where: eq(assignments.courseId, courseId),
  });
}
