import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { students } from "../schema.js";
import type { NewStudent, Student } from "../../types.js";

export async function createStudent(data: NewStudent): Promise<Student> {
  const [row] = await db.insert(students).values(data).returning();
  return row;
}

export async function findStudentById(id: number): Promise<Student | undefined> {
  const [row] = await db.select().from(students).where(eq(students.id, id));
  return row;
}

export async function findStudentByUserId(
  userId: number,
): Promise<Student | undefined> {
  const [row] = await db.select().from(students).where(eq(students.userId, userId));
  return row;
}
