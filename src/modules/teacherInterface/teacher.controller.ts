import { db } from "../../db/db";
import { coursesTable, notificationsTable, studentsTable, enrollmentsTable, teachersTable, users, eventsTable } from "../../db/schemas";
import { eq, and, gte, lte } from "drizzle-orm";

export const getEvents = async (c: any) => {
  try {
    const user = c.get("user");
    const schoolId = user.info.schoolId;
    const teacherId = user.info.id; // teacher's id from token
    const { startDate, endDate } = c.req.query();

    const events = await db
      .select({
        id: eventsTable.id,
        title: eventsTable.title,
        start: eventsTable.date,
        description: eventsTable.description,
        type: eventsTable.type,
        className: eventsTable.className,
        teacherName: users.name,
      })
      .from(eventsTable)
      .leftJoin(coursesTable, eq(eventsTable.courseId, coursesTable.id))
      .leftJoin(teachersTable, eq(coursesTable.teacherId, teachersTable.id))
      .leftJoin(users, eq(teachersTable.userId, users.id))
      .where(
        and(
          eq(eventsTable.schoolId, schoolId),
          eq(coursesTable.teacherId, teacherId), // filter by teacher's courses
          startDate ? gte(eventsTable.date, new Date(startDate)) : undefined,
          endDate ? lte(eventsTable.date, new Date(endDate)) : undefined,
        )
      );

    const formatted = events.map(e => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.start,
      color: e.type === "exam" ? "#ef4444"
           : e.type === "holiday" ? "#22c55e"
           : e.type === "class" ? "#3b82f6"
           : "#f59e0b",
      description: e.description ?? "",
      allDay: e.type === "holiday",
      repeatWeekly: e.type === "class",
      isClass: e.type === "class",
      className: e.className ?? "",
      teacherName: e.teacherName ?? "",
    }));

    return c.json(formatted);
  } catch (err) {
    console.log(err);
    return c.json({ error: "Failed to fetch events" }, 500);
  }
};