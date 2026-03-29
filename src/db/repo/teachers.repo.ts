import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { teachers } from "../schema.js";
import type { NewTeacher, Teacher } from "../../types.js";

export async function createTeacher(data: NewTeacher): Promise<Teacher> {
  const [row] = await db.insert(teachers).values(data).returning();
  return row;
}

export async function findTeacherById(id: number) {
  return db.query.teachers.findFirst({
    where: eq(teachers.id, id),
    with: { user: true },
  });
}

export async function findTeacherByUserId(
  userId: number,
): Promise<Awaited<ReturnType<typeof findTeacherById>> | undefined> {
  return db.query.teachers.findFirst({
    where: eq(teachers.userId, userId),
    with: { user: true },
  });
}

export async function listTeachers(): Promise<
  NonNullable<Awaited<ReturnType<typeof findTeacherById>>>[]
> {
  return db.query.teachers.findMany({
    with: { user: true },
  });
}

export async function updateTeacher(
  id: number,
  data: Partial<NewTeacher>,
): Promise<Teacher | undefined> {
  const [row] = await db
    .update(teachers)
    .set(data)
    .where(eq(teachers.id, id))
    .returning();
  return row;
}

export async function deleteTeacher(id: number): Promise<void> {
  await db.delete(teachers).where(eq(teachers.id, id));
}
