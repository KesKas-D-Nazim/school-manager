import { Context } from "hono";
import { assignmentsRepository, coursesRepository } from "../../db/repo/index.js";
import type { NewAssignment } from "../../types.js";
import type {
	CreateAssignmentBody,
	UpdateAssignmentBody,
} from "./assignments.schema.js";

type AuthUser = {
	role?: "admin" | "teacher" | "student";
	info?: {
		id?: string;
		schoolId?: string;
	};
};

class AssignmentsController {
	async listAssignments(c: Context) {
		const user = c.get("user") as AuthUser | undefined;
		const schoolId =
			user?.role === "admin" ? user?.info?.id : user?.info?.schoolId;

		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		if (user?.role === "teacher") {
			const teacherId = user?.info?.id;

			if (!teacherId) {
				return c.json({ success: false, message: "Unauthorized" }, 401);
			}

			const { data: courses } = await coursesRepository.listCourses({
				schoolId,
				teacherId,
			});
			const assignmentsByCourse = await Promise.all(
				courses.map((course) =>
					assignmentsRepository.listAssignmentsByCourseId(course.id),
				),
			);
			const data = assignmentsByCourse.flat();
			const pagination = { totalCount: data.length, totalPages: 1 };

			return c.json({ success: true, data, pagination }, 200);
		}

		if (user?.role === "student" || user?.role === "admin") {
			const { data, pagination } =
				await assignmentsRepository.listAssignmentsBySchoolId(schoolId);

			return c.json({ success: true, data, pagination }, 200);
		}

		return c.json({ success: false, message: "Forbidden" }, 403);
	}

	async getAssignment(c: Context) {
		const id = c.req.param("id")!;
		const assignment = await assignmentsRepository.findAssignmentById(id);

		if (!assignment) {
			return c.json({ success: false, message: "Assignment not found" }, 404);
		}

		return c.json({ success: true, data: assignment }, 200);
	}

	async createAssignment(c: Context) {
		const user = c.get("user") as AuthUser | undefined;
		const isAdmin = user?.role === "admin";
		const isTeacher = user?.role === "teacher";

		if (!isAdmin && !isTeacher) {
			return c.json({ success: false, message: "Forbidden" }, 403);
		}

		const schoolId = isAdmin ? user?.info?.id : user?.info?.schoolId;
		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const body = (c.req as any).valid("json") as CreateAssignmentBody;

		try {
			const assignment = await assignmentsRepository.createAssignment({
				id: crypto.randomUUID(),
				schoolId,
				...body,
				deadline: new Date(body.deadline),
			});

			return c.json({ success: true, data: assignment }, 201);
		} catch (_error) {
			return c.json(
				{ success: false, message: "Failed to create assignment" },
				400,
			);
		}
	}

	async updateAssignment(c: Context) {
		const user = c.get("user") as AuthUser | undefined;
		const schoolId =
			user?.role === "admin" ? user?.info?.id : user?.info?.schoolId;

		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const id = c.req.param("id")!;
		const body = (c.req as any).valid("json") as UpdateAssignmentBody;
		const assignment = await assignmentsRepository.findAssignmentById(id);

		if (!assignment) {
			return c.json({ success: false, message: "Assignment not found" }, 404);
		}

		const { deadline, ...rest } = body;
		const payload: Partial<NewAssignment> = {
			...rest,
			...(deadline ? { deadline: new Date(deadline) } : {}),
		};

		const updateAndRespond = async () => {
			const updated = await assignmentsRepository.updateAssignment(id, payload);
			if (!updated) {
				return c.json(
					{ success: false, message: "Assignment not found" },
					404,
				);
			}

			return c.json({ success: true, data: updated }, 200);
		};

		if (user?.role === "admin") {
			if (assignment.schoolId !== schoolId) {
				return c.json({ success: false, message: "Forbidden" }, 403);
			}

			return updateAndRespond();
		}

		if (user?.role === "teacher") {
			const course = await coursesRepository.findCourseById(
				assignment.courseId!,
			);
			if (!course || course.teacherId !== user?.info?.id) {
				return c.json({ success: false, message: "Forbidden" }, 403);
			}

			return updateAndRespond();
		}

		return c.json({ success: false, message: "Forbidden" }, 403);
	}

	async deleteAssignment(c: Context) {
		const user = c.get("user") as AuthUser | undefined;
		const schoolId =
			user?.role === "admin" ? user?.info?.id : user?.info?.schoolId;

		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const id = c.req.param("id")!;
		const assignment = await assignmentsRepository.findAssignmentById(id);

		if (!assignment) {
			return c.json({ success: false, message: "Assignment not found" }, 404);
		}

		if (user?.role === "admin") {
			if (assignment.schoolId !== schoolId) {
				return c.json({ success: false, message: "Forbidden" }, 403);
			}

			await assignmentsRepository.deleteAssignment(id);
			return c.json({ success: true, message: "Assignment deleted" }, 200);
		}

		if (user?.role === "teacher") {
			const course = await coursesRepository.findCourseById(
				assignment.courseId!,
			);
			if (!course || course.teacherId !== user?.info?.id) {
				return c.json({ success: false, message: "Forbidden" }, 403);
			}

			await assignmentsRepository.deleteAssignment(id);
			return c.json({ success: true, message: "Assignment deleted" }, 200);
		}

		return c.json({ success: false, message: "Forbidden" }, 403);
	}
}

export const assignmentsController = new AssignmentsController();
