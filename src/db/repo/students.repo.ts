import { db } from "../db.ts";
import { studentsTable, users } from "../schema.ts";
import type { NewStudent, Student } from "../../types.ts";
import { eq, inArray, like, sql } from "drizzle-orm";

export async function createStudent(data: NewStudent): Promise<Student> {
  const [row] = await db.insert(studentsTable).values(data).returning();
  return row;
}

export async function findStudentById(id: string) {
  return db.query.studentsTable.findFirst({
    where: eq(studentsTable.id, id),
    with: { user: true },
  });
}

export async function findStudentByUserId(
  userId: string,
): Promise<Awaited<ReturnType<typeof findStudentById>> | undefined> {
  return db.query.studentsTable.findFirst({
    where: eq(studentsTable.userId, userId),
    with: { user: true },
  });
}

export async function listStudents(
  search?: string,
  page = 1,
  limit = 10,
  name = "",
  email = "",
  sortBy = "name",
  sortOrder = "asc",
  grade = "",
  status = ""

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
      studentsTable.userId,
      db
        .select({ id: users.id })
        .from(users)
        .where(like(users.username, `%${searchValue}%`)),
    )
    : undefined;

  const totalQuery = whereClause
    ? db
      .select({ total: sql<number>`count(*)` })
      .from(studentsTable)
      .where(whereClause)
    : db.select({ total: sql<number>`count(*)` }).from(studentsTable);
  const [totalRow] = await totalQuery;
  const total = Number(totalRow?.total ?? 0);

  const data = whereClause
    ? await db.query.studentsTable.findMany({
      where: whereClause,
      with: { user: true },
      limit: safeLimit,
      offset,
    })
    : await db.query.studentsTable.findMany({
      with: { user: true },
      limit: safeLimit,
      offset,
    });

  return { data, total };
}

// add both size and page

export async function updateStudent(
  id: string,
  data: Partial<NewStudent>,
): Promise<Student | undefined> {
  const [row] = await db
    .update(studentsTable)
    .set(data)
    .where(eq(studentsTable.id, id))
    .returning();
  return row;
}

export async function deleteStudent(id: string): Promise<void> {
  await db.delete(studentsTable).where(eq(studentsTable.id, id));
}
