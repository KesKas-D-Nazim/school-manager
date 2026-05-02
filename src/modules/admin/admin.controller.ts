import { Context } from "hono";
import { ITeachersRepository, teachersRepository } from "../../db/repo/index.js";
import { addMultipleSchemaBody } from "./admin.schemas.js";
import { db } from "../../db/db.js";
import { eq, and, gte, lte } from "drizzle-orm";
import { TeacherSearchSchema } from "../../types.js";
import { adminService } from "./admin.service.js";
import { eventsTable, teachersTable, users } from "../../db/schemas.js";


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

  } catch (err) {
    console.log(err);
    return c.json({ error: "Failed to create event" }, 500);
  }
}

class AdminController {

  constructor(private teachersRepo: ITeachersRepository) { }


  async addMultipleTeachers(c: Context) {
    const { file, type, schoolId } = await c.req.formData().then(form => {
      const file = form.get("file") as File;
      const type = form.get("type") as string;
      const schoolId = form.get("schoolId") as string;
      return { file, type, schoolId };
    })

    const validation = addMultipleSchemaBody.safeParse({ file, type, schoolId });
    if (!validation.success) {
      return c.json({ success: false, message: "Invalid input data" }, 400);
    }


    const { isMatches, data } = await adminService.isExcelMatches(file);
    if (!isMatches) {
      return c.json({ success: false, message: "Excel file does not match the required format." }, 400);
    }
    if (data === undefined || data?.length === 0) {
      return c.json({ success: false, message: "No data found in the Excel file." }, 400);
    }

    const result = await adminService.insertInDb(type, data, schoolId);

    if (!result.success) {
      return c.json({ success: false, message: result.message ?? `Failed to add ${type === "teacher" ? "teachers" : "students"}.` }, 500);
    }

    return c.json({ success: true, message: result.message }, 200);

  }

  async TotalTeachers(c: Context) {
    const schoolId = c.req.query("schoolId")!;
    const result = await this.teachersRepo.getTotalTeachers(schoolId);
    console.log("Total teachers : ", result);
    return c.json({ success: true, data: result }, 200);
  }
}
export const adminController = new AdminController(teachersRepository);

