import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { students } from "../schema.js";
import type { NewStudent, Student } from "../../types.js";

export async function createStudent(data: NewStudent): Promise<Student> {
  const [row] = await db.insert(students).values(data).returning();
  return row;
}

export async function findStudentById(id: number): Promise<Student | undefined> {
  return db.query.students.findFirst({
    where: eq(students.id, id),
  });
}

export async function findStudentByUserId(
  userId: number,
): Promise<Student | undefined> {
  return db.query.students.findFirst({
    where: eq(students.userId, userId),
  });
}
