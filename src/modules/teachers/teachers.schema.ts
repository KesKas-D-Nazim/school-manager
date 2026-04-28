import z from "zod";

export const TeacherSearchSchema = z.object({
	search: z.string().optional(),
	page: z.coerce.number().default(1),
	size: z.coerce.number().default(10),
	sortBy: z.string().optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
	subject: z.string().optional(),
});

export const createTeacherSchema = z.object({
	name: z.string().min(2).max(50),
	email: z.string().email(),
	password: z.string().min(8),
	gender: z.enum(["male", "female"]).optional(),
	telNumber: z.string().optional(),
	address: z.string().optional(),
	subjects: z.string().optional(),
	dateOfBirth: z.string().optional(),
	joiningDate: z.string().optional(),
	status: z.enum(["Active", "Inactive", "Pending", "New"]).optional(),
});

export const updateTeacherSchema = createTeacherSchema.omit({
	email: true,
	password: true,
}).partial();

export type CreateTeacherBody = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherBody = z.infer<typeof updateTeacherSchema>;
export type TeacherSearchSchema = z.infer<typeof TeacherSearchSchema>;
