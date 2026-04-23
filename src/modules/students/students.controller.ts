import { db } from "../../db/db";
import { coursesTable, notificationsTable, studentsTable } from "../../db/schemas";
import { eq } from "drizzle-orm";


export const getCourses = async (c: any) => {
  try {
    const user = c.get("user");
    console.log("USER:", JSON.stringify(user, null, 2)); 

    const courses = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.schoolId, user.info.schoolId)
  );

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
