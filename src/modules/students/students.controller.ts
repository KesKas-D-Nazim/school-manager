<<<<<<< HEAD
=======
import { db } from "../../db/db";
import { coursesTable, notificationsTable, studentsTable, enrollmentsTable, teachersTable, users } from "../../db/schemas";
>>>>>>> ddf50faac520890ead948dcdfd8285bb11b1b0bb
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { db } from "../../db/db.ts";
import { studentsRepository } from "../../db/repo/index.ts";
import { users } from "../../db/schemas.ts";
import { auth } from "../../utils/auth.ts";
import type { CreateStudentBody, UpdateStudentBody } from "./students.schema.ts";

<<<<<<< HEAD
type AuthUser = {
	role?: "admin" | "teacher" | "student";
	info?: {
		id?: string;
		schoolId?: string;
	};
};

class StudentsController {
	async listStudents(c: Context) {
		const user = c.get("user") as AuthUser | undefined;
		const schoolId =
			user?.role === "student" ? user?.info?.schoolId : user?.info?.id;

		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const searchQueries = (c.req as any).valid(
			"query",
		) as Parameters<typeof studentsRepository.listStudents>[0];
		const { data, pagination } = await studentsRepository.listStudents({
			...searchQueries,
			schoolId,
		});

		return c.json({ success: true, data, pagination }, 200);
	}

	async getStudent(c: Context) {
		const id = c.req.param("id")!;
		const student = await studentsRepository.findStudentById(id);

		if (!student) {
			return c.json({ success: false, message: "Student not found" }, 404);
		}

		return c.json({ success: true, data: student }, 200);
	}

	async createStudent(c: Context) {
		const user = c.get("user") as AuthUser | undefined;

		if (user?.role !== "admin") {
			return c.json({ success: false, message: "Forbidden" }, 403);
		}

		const schoolId = user.info?.id;
		if (!schoolId) {
			return c.json({ success: false, message: "School not found" }, 400);
		}

		const body = (c.req as any).valid("json") as CreateStudentBody;
		const { name, email, password, ...rest } = body;

		let newUser: Awaited<ReturnType<typeof auth.api.signUpEmail>>;
		try {
			newUser = await auth.api.signUpEmail({
				body: {
					name,
					email,
					password,
					role: "student",
				},
			});
		} catch (error: any) {
			const code = String(error?.body?.code || error?.code || "").toUpperCase();
			const message = String(error?.body?.message || error?.message || "").toLowerCase();

			if (code === "USER_ALREADY_EXISTS" || message.includes("already exists")) {
				return c.json({ success: false, message: "Email already exists" }, 409);
			}

			return c.json({ success: false, message: "Failed to create student" }, 400);
		}

		const student = await studentsRepository.createStudent({
			id: crypto.randomUUID() as string,
			schoolId,
			userId: newUser.user.id!,
			...rest,
		});

		return c.json({ success: true, data: student }, 201);
	}

	async updateStudent(c: Context) {
		const user = c.get("user") as AuthUser | undefined;
		const schoolId =
			user?.role === "student" ? user?.info?.schoolId : user?.info?.id;

		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const id = c.req.param("id")!;
		const body = (c.req as any).valid("json") as UpdateStudentBody;
		const student = await studentsRepository.findStudentById(id);

		if (!student) {
			return c.json({ success: false, message: "Student not found" }, 404);
		}

		if (student.schoolId !== schoolId) {
			return c.json({ success: false, message: "Forbidden" }, 403);
		}

		const updated = await studentsRepository.updateStudent(id, body);

		if (!updated) {
			return c.json({ success: false, message: "Student not found" }, 404);
		}

		return c.json({ success: true, data: updated }, 200);
	}

	async deleteStudent(c: Context) {
		const user = c.get("user") as AuthUser | undefined;
		const schoolId =
			user?.role === "student" ? user?.info?.schoolId : user?.info?.id;

		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const id = c.req.param("id")!;
		const student = await studentsRepository.findStudentById(id);

		if (!student) {
			return c.json({ success: false, message: "Student not found" }, 404);
		}

		if (student.schoolId !== schoolId) {
			return c.json({ success: false, message: "Forbidden" }, 403);
		}

		if (!student.userId) {
			return c.json({ success: false, message: "Student user not found" }, 404);
		}

		await db.delete(users).where(eq(users.id, student.userId));

		return c.json({ success: true, message: "Student deleted" }, 200);
	}
}

export const studentsController = new StudentsController();
=======

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
>>>>>>> ddf50faac520890ead948dcdfd8285bb11b1b0bb
