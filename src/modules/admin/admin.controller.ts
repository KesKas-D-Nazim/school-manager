import { db }from "../../db/db";
import { eventsTable, teachersTable, users } from "../../db/schemas"
import { eq, and, gte, lte } from "drizzle-orm"

export const getEvents = async (c: any) => {
  try {
    const user = c.get("user");
    const schoolId = user.info.id;
    const { startDate, endDate } = c.req.query();

    const events = await db
      .select({
        id: eventsTable.id,
        title: eventsTable.title,
        start: eventsTable.date,
        end: eventsTable.endDate,
        description: eventsTable.description,
        className: eventsTable.className,
        teacherName: users.name,
        color: eventsTable.color,
        allDay: eventsTable.allDay,
        repeatWeekly: eventsTable.repeatWeekly,
        isClass: eventsTable.isClass,
      })
      .from(eventsTable)
      .leftJoin(teachersTable, eq(eventsTable.teacherId, teachersTable.id))
      .leftJoin(users, eq(teachersTable.userId, users.id))
      .where(
        and(
          eq(eventsTable.schoolId, schoolId),
          startDate ? gte(eventsTable.date, new Date(startDate)) : undefined,
          endDate ? lte(eventsTable.date, new Date(endDate)) : undefined,
     )
    );

    const formatted = events.map(e => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end ?? e.start,
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

export const postEvent = async (c: any) => {
  try {
    const user = c.get("user");
    const schoolId = user.info.id; 

    const body = await c.req.json();

    let teacherId = null;
    if (body.isClass && body.teacherName) {
      const teacher = await db
        .select({ id: teachersTable.id })
        .from(teachersTable)
        .leftJoin(users, eq(teachersTable.userId, users.id))
        .where(
          and(
            eq(teachersTable.schoolId, schoolId),
            eq(users.name, body.teacherName)
          )
        )
        .limit(1);

      teacherId = teacher[0]?.id ?? null;
    }

    await db.insert(eventsTable).values({
      id: crypto.randomUUID(),
      schoolId,
      title: body.title,
      description: body.description ?? null,
      date: new Date(body.start),
      endDate: new Date(body.end),
      color: body.color ?? null,
      allDay: body.allDay ?? false,
      repeatWeekly: body.repeatWeekly ?? false,
      isClass: body.isClass ?? false,
      className: body.className ?? null,
      teacherId: teacherId,
    });

    return c.json({ message: "Event created" }, 201);
  } catch (err) {
    console.log(err);
    return c.json({ error: "Failed to create event" }, 500);
  }
};

export const editEvent = async (c: any) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    let teacherId = null;
    if (body.isClass && body.teacherName) {
      const teacher = await db
        .select({ id: teachersTable.id })
        .from(teachersTable)
        .leftJoin(users, eq(teachersTable.userId, users.id))
        .where(eq(users.name, body.teacherName))
        .limit(1);
      teacherId = teacher[0]?.id ?? null;
    }

    await db.update(eventsTable)
      .set({
        title: body.title,
        description: body.description ?? null,
        date: new Date(body.start),
        endDate: new Date(body.end),
        color: body.color ?? null,
        allDay: body.allDay ?? false,
        repeatWeekly: body.repeatWeekly ?? false,
        isClass: body.isClass ?? false,
        className: body.className ?? null,
        teacherId: teacherId,
      })
      .where(eq(eventsTable.id, id));

    return c.json({ message: "Event updated" }, 200);
  } catch (err) {
    console.log(err);
    return c.json({ error: "Failed to update event" }, 500);
  }
};

export const deleteEvent = async (c: any) => {
  try {
    const id = c.req.param("id");

    await db.delete(eventsTable).where(eq(eventsTable.id, id));

    return c.json({ message: "Event deleted" }, 200);
  } catch (err) {
    console.log(err);
    return c.json({ error: "Failed to delete event" }, 500);
  }
};