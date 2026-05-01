import { eq } from "drizzle-orm";
import { Context } from "hono";
import { db } from "../../db/db.ts";
import { teachersRepository } from "../../db/repo/index.ts";
import { users } from "../../db/schemas.ts";
import { auth } from "../../utils/auth.ts";
import type { CreateTeacherBody, UpdateTeacherBody } from "./teachers.schema.ts";

type AuthUser = {
	role?: "admin" | "teacher" | "student";
	info?: {
		id?: string;
		schoolId?: string;
	};
};

class TeachersController {
	async listTeachers(c: Context) {
		const user = c.get("user") as AuthUser | undefined;
		const schoolId =
			user?.role === "teacher" ? user?.info?.schoolId : user?.info?.id;

		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const searchQueries = (c.req as any).valid(
			"query",
		) as Parameters<typeof teachersRepository.listTeachers>[0];
		const { data, pagination } = await teachersRepository.listTeachers({
			...searchQueries,
			schoolId,
		});

		return c.json({ 
			success: true, 
			data: data.map(t => ({
				id: t.id,
				name: t.user?.name,        
				email: t.user?.email,      
				role: t.user?.role,        
				gender: t.gender,
				number: t.user?.telNumber,       
				address: t.address,
				subjects: t.subject ? t.subject.split(",") : [], 
				dateOfBirth: t.dateOfBirth,
				joiningDate: t.joiningDate,
				status: t.status,
				schoolId: t.schoolId,
				departement: "",           
				imgSrc: "",                
				password: "",              
			})),
			pagination: {
				totalPages: pagination.totalPages,
				totalElements: pagination.totalCount,
			}
		}, 200);
	}

	async getTeacher(c: Context) {
		const id = c.req.param("id")!;
		const teacher = await teachersRepository.findTeacherById(id);

		if (!teacher) {
			return c.json({ success: false, message: "Teacher not found" }, 404);
		}

		return c.json({ success: true, data: teacher }, 200);
	}

	async createTeacher(c: Context) {
		const user = c.get("user") as AuthUser | undefined;

		if (user?.role !== "admin") {
			return c.json({ success: false, message: "Forbidden" }, 403);
		}

		const schoolId = user.info?.id;
		if (!schoolId) {
			return c.json({ success: false, message: "School not found" }, 400);
		}

		const body = (c.req as any).valid("json") as CreateTeacherBody;
		const { name, email, password, ...rest } = body;

		let newUser: Awaited<ReturnType<typeof auth.api.signUpEmail>>;
		try {
			newUser = await auth.api.signUpEmail({
				body: {
					name,
					email,
					password,
					role: "teacher",
				},
			});
		} catch (error: any) {
			const code = String(error?.body?.code || error?.code || "").toUpperCase();
			const message = String(error?.body?.message || error?.message || "").toLowerCase();

			if (code === "USER_ALREADY_EXISTS" || message.includes("already exists")) {
				return c.json({ success: false, message: "Email already exists" }, 409);
			}

			return c.json({ success: false, message: "Failed to create teacher" }, 400);
		}

		const teacher = await teachersRepository.createTeacher({
			id: crypto.randomUUID() as string,
			schoolId: schoolId!,
			userId: newUser.user.id!,
			...rest,
		});

		return c.json({ success: true, data: teacher }, 201);
	}

	async updateTeacher(c: Context) {
		const user = c.get("user") as AuthUser | undefined;
		const schoolId =
			user?.role === "teacher" ? user?.info?.schoolId : user?.info?.id;

		if (!schoolId) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		const id = c.req.param("id")!;
		const body = (c.req as any).valid("json") as UpdateTeacherBody;
		const teacher = await teachersRepository.findTeacherById(id);

		if (!teacher) {
			return c.json({ success: false, message: "Teacher not found" }, 404);
		}

		if (teacher.schoolId !== schoolId) {
			return c.json({ success: false, message: "Forbidden" }, 403);
		}

		const updated = await teachersRepository.updateTeacher(id, body);

		if (!updated) {
			return c.json({ success: false, message: "Teacher not found" }, 404);
		}

		return c.json({ success: true, data: updated }, 200);
	}

	async deleteTeacher(c: Context) {
		const user = c.get("user") as AuthUser | undefined;

		const id = c.req.param("id")!;
		const teacher = await teachersRepository.findTeacherById(id);
		
		const schoolId = user?.info?.id;

		if (!teacher) {
			return c.json({ success: false, message: "Teacher not found" }, 404);
		}

        if (teacher.schoolId !== schoolId) {
			return c.json({ success: false, message: "Forbidden" }, 403);
		}

		if (!teacher.userId) {
			return c.json({ success: false, message: "Teacher user not found" }, 404);
		}

		await db.delete(users).where(eq(users.id, teacher.userId));

		return c.json({ success: true, message: "Teacher deleted" }, 200);
	}
}

export const teachersController = new TeachersController();
