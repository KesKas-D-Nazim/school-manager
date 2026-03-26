import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { teachers } from "../schema.js";
import type { NewTeacher, Teacher } from "../../types.js";

export async function createTeacher(data: NewTeacher): Promise<Teacher> {
  const [row] = await db.insert(teachers).values(data).returning();
  return row;
}

export async function findTeacherById(id: number): Promise<Teacher | undefined> {
  return db.query.teachers.findFirst({
    where: eq(teachers.id, id),
  });
}

export async function findTeacherByUserId(
  userId: number,
): Promise<Teacher | undefined> {
  return db.query.teachers.findFirst({
    where: eq(teachers.userId, userId),
  });
}
