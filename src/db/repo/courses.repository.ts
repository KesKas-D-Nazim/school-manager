// import { eq } from "drizzle-orm";

// import { db } from "../db.js";
// import { coursesTable } from "../schemas.js";
// import type { Course, NewCourse } from "../../types.js";

// export async function createCourse(data: NewCourse): Promise<Course> {
//   const [row] = await db.insert(coursesTable).values(data).returning();
//   return row;
// }

// export async function findCourseById(id: string): Promise<Course | undefined> {
//   return db.query.coursesTable.findFirst({
//     where: eq(coursesTable.id, id),
//   });
// }

// export async function listCoursesByTeacherId(
//   teacherId: string,
// ): Promise<Course[]> {
//   return db.query.coursesTable.findMany({
//     where: eq(coursesTable.teacherId, teacherId),
//   });
// }
