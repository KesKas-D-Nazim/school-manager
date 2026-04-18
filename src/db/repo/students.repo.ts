import { and, eq, inArray, like, sql } from "drizzle-orm";

import { db } from "../db.js";
import { students, users } from "../schema.js";
import type { NewStudent, NewUser, Student, User } from "../../types.js";

export async function createStudent(data: NewStudent): Promise<Student> {
  const [row] = await db.insert(students).values(data).returning();
  return row;
}

export async function createStudentWithUser(
  userData: NewUser,
  studentData: Omit<NewStudent, "userId">,
): Promise<{ user: User; student: Student }> {
  return db.transaction(async (tx) => {
    const [user] = await tx.insert(users).values(userData).returning();
    const [student] = await tx
      .insert(students)
      .values({ ...studentData, userId: user.id })
      .returning();

    return { user, student };
  });
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
  page?: number,
  limit?: number,
  grade?: string,
  classe?: string,
  status?: string,
  gender?: string,
): Promise<{
  data: NonNullable<Awaited<ReturnType<typeof findStudentById>>>[];
  total: number;
}> {
  const safePage = Math.max(1, page ?? 1);
  const safeLimit = Math.max(1, limit ?? 10);
  const offset = (safePage - 1) * safeLimit;
  const searchValue = search?.trim();
  const gradeValue = grade?.trim();
  const classeValue = classe?.trim();
  const statusValue = status?.trim();
  const genderValue = gender?.trim();

  const conditions = [];

  if (searchValue) {
    conditions.push(
      inArray(
        students.userId,
        db
          .select({ id: users.id })
          .from(users)
          .where(like(users.username, `%${searchValue}%`)),
      ),
    );
  }

  if (gradeValue) {
    conditions.push(eq(students.grade, gradeValue));
  }

  if (classeValue) {
    conditions.push(eq(students.classe, classeValue));
  }

  if (statusValue) {
    conditions.push(eq(students.status, statusValue));
  }

  if (genderValue) {
    conditions.push(eq(students.gender, genderValue));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

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
  const student = await db.query.students.findFirst({
    where: eq(students.id, id),
  });

  if (!student) {
    return;
  }

  await db.delete(users).where(eq(users.id, student.userId));
}
