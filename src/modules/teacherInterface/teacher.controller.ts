import { db } from "../../db/db.js";
import { coursesTable, notificationsTable, studentsTable, enrollmentsTable, teachersTable, users, eventsTable } from "../../db/schemas.js";
import { eq, and, or, gte, lte } from "drizzle-orm";

export const getCourses = async (c: any) => {
  try {
    const user = c.get("user");
    const teacherId = user.info.id;

    const courses = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.teacherId, user.info.id)
  );

    return c.json(courses);
  } catch (err) {
    return c.json({ error: "Failed to fetch courses" }, 500);
  }
};

export const getEvents = async (c: any) => {
  try {
    const user = c.get("user");
    const schoolId = user.info.schoolId;
    const teacherId = user.info.id;
    const { startDate, endDate } = c.req.query();

    const events = await db
      .select({
        id: eventsTable.id,
        title: eventsTable.title,
        start: eventsTable.date, 
        endDate: eventsTable.endDate, 
        description: eventsTable.description,
        className: eventsTable.className,
        teacherName: users.name,
        color: eventsTable.color,
        allDay: eventsTable.allDay,
        repeatWeekly: eventsTable.repeatWeekly,
        isClass: eventsTable.isClass,
      })
      .from(eventsTable)
      .leftJoin(coursesTable, eq(eventsTable.courseId, coursesTable.id))
      .leftJoin(teachersTable, eq(eventsTable.teacherId, teachersTable.id))
      .leftJoin(users, eq(teachersTable.userId, users.id))
      .where(
        and(
          eq(eventsTable.schoolId, schoolId),
          or(
            eq(eventsTable.teacherId, teacherId),
            eq(eventsTable.isClass, false)
          ),
          startDate ? gte(eventsTable.date, new Date(startDate)) : undefined,
          endDate ? lte(eventsTable.date, new Date(endDate)) : undefined,
        )
      );

    const formatted = events.map(e => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.endDate ?? e.start,           
      color: e.color ?? "#3b82f6",      
      description: e.description ?? "",
      allDay: e.allDay ?? false,
      repeatWeekly: e.repeatWeekly ?? false,
      isClass: e.isClass ?? false,
      className: e.className ?? "",
      teacherName: e.teacherName ?? "",
    }));

    return c.json(formatted);
  } catch (err) {
    console.log(err);
    return c.json({ error: "Failed to fetch events" }, 500);
  }
};