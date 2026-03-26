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
  const [row] = await db.select().from(assignments).where(eq(assignments.id, id));
  return row;
}

export async function listAssignmentsByCourseId(
  courseId: number,
): Promise<Assignment[]> {
  return db.select().from(assignments).where(eq(assignments.courseId, courseId));
}
