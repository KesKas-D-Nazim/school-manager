import { eq, inArray, like, sql } from "drizzle-orm";

import { db } from "../db.js";
import { students, users } from "../schema.js";
import type { NewStudent, Student } from "../../types.js";

export async function createStudent(data: NewStudent): Promise<Student> {
  const [row] = await db.insert(students).values(data).returning();
  return row;
}

export async function findStudentById(id: number) {
  return db.query.students.findFirst({
    where: eq(students.id, id),
    with: { user: true },
  });
}

export async function findStudentByUserId(
  userId: number,
): Promise<Awaited<ReturnType<typeof findStudentById>> | undefined> {
  return db.query.students.findFirst({
    where: eq(students.userId, userId),
    with: { user: true },
  });
}

export async function listStudents(
  search?: string,
  page = 1,
  limit = 10,
): Promise<{
  data: NonNullable<Awaited<ReturnType<typeof findStudentById>>>[];
  total: number;
}> {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const offset = (safePage - 1) * safeLimit;
  const searchValue = search?.trim();

  const whereClause = searchValue
    ? inArray(
        students.userId,
        db
          .select({ id: users.id })
          .from(users)
          .where(like(users.username, `%${searchValue}%`)),
      )
    : undefined;

  const totalQuery = whereClause
    ? db
        .select({ total: sql<number>`count(*)` })
        .from(students)
        .where(whereClause)
    : db.select({ total: sql<number>`count(*)` }).from(students);
  const [totalRow] = await totalQuery;
  const total = Number(totalRow?.total ?? 0);

  const data = whereClause
    ? await db.query.students.findMany({
        where: whereClause,
        with: { user: true },
        limit: safeLimit,
        offset,
      })
    : await db.query.students.findMany({
        with: { user: true },
        limit: safeLimit,
        offset,
      });

  return { data, total };
}

export async function updateStudent(
  id: number,
  data: Partial<NewStudent>,
): Promise<Student | undefined> {
  const [row] = await db
    .update(students)
    .set(data)
    .where(eq(students.id, id))
    .returning();
  return row;
}

export async function deleteStudent(id: number): Promise<void> {
  await db.delete(students).where(eq(students.id, id));
}
