import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { courses } from "../schema.js";
import type { Course, NewCourse } from "../../types.js";

export async function createCourse(data: NewCourse): Promise<Course> {
  const [row] = await db.insert(courses).values(data).returning();
  return row;
}

export async function findCourseById(id: number): Promise<Course | undefined> {
  const [row] = await db.select().from(courses).where(eq(courses.id, id));
  return row;
}

export async function listCoursesByTeacherId(
  teacherId: number,
): Promise<Course[]> {
  return db.select().from(courses).where(eq(courses.teacherId, teacherId));
}
