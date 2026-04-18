import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { teachers, users } from "../schema.js";
import type { NewTeacher, NewUser, Teacher, User } from "../../types.js";

function parseTeacherSubjects<T extends { subjects: string | null }>(
  teacher: T,
): Omit<T, "subjects"> & { subjects: unknown } {
  try {
    return {
      ...teacher,
      subjects: JSON.parse(teacher.subjects ?? "[]"),
    };
  } catch {
    return {
      ...teacher,
      subjects: [],
    };
  }
}

export async function createTeacher(data: NewTeacher): Promise<Teacher> {
  const [row] = await db.insert(teachers).values(data).returning();
  return row;
}

export async function createTeacherWithUser(
  userData: NewUser,
  teacherData: Omit<NewTeacher, "userId">,
): Promise<{ user: User; teacher: Teacher }> {
  return db.transaction(async (tx) => {
    const [user] = await tx.insert(users).values(userData).returning();
    const serializedSubjects = JSON.stringify(teacherData.subjects ?? []);
    const [teacher] = await tx
      .insert(teachers)
      .values({ ...teacherData, userId: user.id, subjects: serializedSubjects })
      .returning();

    return { user, teacher };
  });
}

export async function findTeacherById(id: number) {
  const teacher = await db.query.teachers.findFirst({
    where: eq(teachers.id, id),
    with: { user: true },
  });

  if (!teacher) {
    return undefined;
  }

  return parseTeacherSubjects(teacher);
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
  const teacherRows = await db.query.teachers.findMany({
    with: { user: true },
  });

  return teacherRows.map((teacher) => parseTeacherSubjects(teacher));
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
  const teacher = await db.query.teachers.findFirst({
    where: eq(teachers.id, id),
  });

  if (!teacher) {
    return;
  }

  await db.delete(users).where(eq(users.id, teacher.userId));
}
