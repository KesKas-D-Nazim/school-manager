import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { courses } from "../schema.js";
import type { Course, NewCourse } from "../../types.js";

export async function createCourse(data: NewCourse): Promise<Course> {
  const [row] = await db.insert(courses).values(data).returning();
  return row;
}

export async function findCourseById(id: number): Promise<Course | undefined> {
  return db.query.courses.findFirst({
    where: eq(courses.id, id),
    with: {
      teacher: { with: { user: true } },
      files: { with: { file: true } },
      assignments: true,
      references: true,
    },
  });
}

export async function findCourseByName(name: string) {
  return db.query.courses.findFirst({
    where: eq(courses.name, name),
    with: {
      teacher: { with: { user: true } },
      files: { with: { file: true } },
      assignments: true,
      references: true,
    },
  });
}

export async function listAllCourses() {
  return db.query.courses.findMany({
    with: {
      teacher: { with: { user: true } },
    },
  });
}

export async function listCoursesByTeacherId(
  teacherId: number,
): Promise<Course[]> {
  return db.query.courses.findMany({
    where: eq(courses.teacherId, teacherId),
  });
}
