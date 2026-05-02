import { Context } from "hono";
import { coursesRepository } from "../../db/repo/index.js";
import type { CreateCourseBody, UpdateCourseBody } from "./courses.schema.js";

type AuthUser = {
	role?: "admin" | "teacher" | "student";
	info?: {
		id?: string;
		schoolId?: string;
	};
};

class CoursesController {
	async listCourses(c: Context) {
		const user = c.get("user") as AuthUser | undefined;
		const schoolId =
			user?.role === "admin" ? user?.info?.id : user?.info?.schoolId;

		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const searchQueries = (c.req as any).valid(
			"query",
		) as Parameters<typeof coursesRepository.listCourses>[0];

		const queries =
			user?.role === "teacher"
				? { ...searchQueries, teacherId: user.info?.id }
				: searchQueries;

		const { data, pagination } = await coursesRepository.listCourses({
			...queries,
			schoolId,
		});

		return c.json({ success: true, data, pagination }, 200);
	}

	async getCourse(c: Context) {
		const id = c.req.param("id")!;
		const course = await coursesRepository.findCourseById(id);

		if (!course) {
			return c.json({ success: false, message: "Course not found" }, 404);
		}

		return c.json({ success: true, data: course }, 200);
	}

	async getCourseByName(c: Context) {
		const name = c.req.param("name")!;
		const user = c.get("user") as AuthUser | undefined;
		const schoolId =
			user?.role === "admin" ? user?.info?.id : user?.info?.schoolId;

		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const course = await coursesRepository.findCourseByName(name, schoolId);

		if (!course) {
			return c.json({ success: false, message: "Course not found" }, 404);
		}

		return c.json({ success: true, data: course }, 200);
	}

	async createCourse(c: Context) {
		const user = c.get("user") as AuthUser | undefined;

		if (user?.role !== "admin" && user?.role !== "teacher") {
			return c.json({ success: false, message: "Forbidden" }, 403);
		}

		const schoolId =
			user.role === "admin" ? user.info?.id : user.info?.schoolId;
		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const body = (c.req as any).valid("json") as CreateCourseBody;
		const teacherId =
			user.role === "teacher" ? user.info?.id : body.teacherId;

		try {
			const course = await coursesRepository.createCourse({
				id: crypto.randomUUID() as string,
				schoolId,
				...body,
				teacherId,
			});

			return c.json({ success: true, data: course }, 201);
		} catch (_error) {
			return c.json({ success: false, message: "Failed to create course" }, 400);
		}
	}

	async updateCourse(c: Context) {
		const user = c.get("user") as AuthUser | undefined;
		const schoolId =
			user?.role === "admin" ? user?.info?.id : user?.info?.schoolId;

		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const id = c.req.param("id")!;
		const body = (c.req as any).valid("json") as UpdateCourseBody;
		const course = await coursesRepository.findCourseById(id);

		if (!course) {
			return c.json({ success: false, message: "Course not found" }, 404);
		}

		const isAdmin = user?.role === "admin";
		const isTeacherOwner = course.teacherId === user?.info?.id;

		if (!isAdmin && !isTeacherOwner) {
			return c.json({ success: false, message: "Forbidden" }, 403);
		}

		const updated = await coursesRepository.updateCourse(id, body);

        if (!updated) return c.json({ success: false, message: "Course not found" }, 404)
            return c.json({ success: true, data: updated }, 200);
	}

	async deleteCourse(c: Context) {
		const user = c.get("user") as AuthUser | undefined;
		const schoolId =
			user?.role === "admin" ? user?.info?.id : user?.info?.schoolId;

		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const id = c.req.param("id")!;
		const course = await coursesRepository.findCourseById(id);

		if (!course) {
			return c.json({ success: false, message: "Course not found" }, 404);
		}

		const isAdmin = user?.role === "admin";
		const isTeacherOwner = course.teacherId === user?.info?.id;

		if (!isAdmin && !isTeacherOwner) {
			return c.json({ success: false, message: "Forbidden" }, 403);
		}

		await coursesRepository.deleteCourse(id);

		return c.json({ success: true, message: "Course deleted" }, 200);
	}
}

export const coursesController = new CoursesController();
