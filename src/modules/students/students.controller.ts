import { db } from "../../db/db";
import { coursesTable, notificationsTable, studentsTable, enrollmentsTable, teachersTable, users } from "../../db/schemas";
import { eq } from "drizzle-orm";


export const getCourses = async (c: any) => {
  try {
    const user = c.get("user");
    // console.log("USER:", JSON.stringify(user, null, 2)); 
    const studentId = user.info.id;

    const courses = await db
      .select({
        id: coursesTable.id,
        name: coursesTable.name,
        description: coursesTable.description,
        teacherName: users.name,
        createdAt: coursesTable.createdAt,
      })
      .from(enrollmentsTable)
      .innerJoin(coursesTable, eq(enrollmentsTable.courseId, coursesTable.id))
      .leftJoin(teachersTable, eq(coursesTable.teacherId, teachersTable.id))
      .leftJoin(users, eq(teachersTable.userId, users.id))      
      .where(eq(enrollmentsTable.studentId, studentId));    

  //   const courses = await db
  //     .select()
  //     .from(coursesTable)
  //     .where(eq(coursesTable.schoolId, user.info.schoolId)
  // );

    return c.json({ courses });
  } catch (err) {
    return c.json({ error: "Failed to fetch courses" }, 500);
  }
};

export const getNotifications = async (c: any) => {
  try {
    const student = c.get("user");

    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.schoolId, student.schoolId));

    return c.json({ notifications });
  } catch (err) {
    return c.json({ error: "Failed to fetch notifications "}, 500);
  }
}
