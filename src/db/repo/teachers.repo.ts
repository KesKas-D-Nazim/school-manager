import { eq, inArray, like, sql } from "drizzle-orm";

import { db } from "../db.js";
import { teachersTable, users } from "../schema.js";
import type { NewTeacher, Teacher } from "../../types.js";

export async function createTeacher(data: NewTeacher): Promise<Teacher> {
  const [row] = await db.insert(teachersTable).values(data).returning();
  return row;
}

export async function findTeacherById(id: string) {
  return db.query.teachersTable.findFirst({
    where: eq(teachersTable.id, id),
    with: { user: true },
  });
}

export async function findTeacherByUserId(
  userId: string,
): Promise<Awaited<ReturnType<typeof findTeacherById>> | undefined> {
  return db.query.teachersTable.findFirst({
    where: eq(teachersTable.userId, userId),
    with: { user: true },
  });
}

export async function listTeachers(
  search?: string,
  page = 1,
  limit = 10,
): Promise<{
  data: NonNullable<Awaited<ReturnType<typeof findTeacherById>>>[];
  total: number;
}> {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const offset = (safePage - 1) * safeLimit;
  const searchValue = search?.trim();

  const whereClause = searchValue
    ? inArray(
      teachersTable.userId,
      db
        .select({ id: users.id })
        .from(users)
        .where(like(users.username, `%${searchValue}%`)),
    )
    : undefined;

  const totalQuery = whereClause
    ? db
      .select({ total: sql<number>`count(*)` })
      .from(teachersTable)
      .where(whereClause)
    : db.select({ total: sql<number>`count(*)` }).from(teachersTable);
  const [totalRow] = await totalQuery;
  const total = Number(totalRow?.total ?? 0);

  const data = whereClause
    ? await db.query.teachersTable.findMany({
      where: whereClause,
      with: { user: true },
      limit: safeLimit,
      offset,
    })
    : await db.query.teachersTable.findMany({
      with: { user: true },
      limit: safeLimit,
      offset,
    });

  return { data, total };
}



export async function updateTeacher(
  id: string,
  data: Partial<NewTeacher>,
): Promise<Teacher | undefined> {
  const [row] = await db
    .update(teachersTable)
    .set(data)
    .where(eq(teachersTable.id, id))
    .returning();
  return row;
}

export async function deleteTeacher(id: string): Promise<void> {
  await db.delete(teachersTable).where(eq(teachersTable.id, id));
}
