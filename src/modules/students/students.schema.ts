import z from "zod";

export const StudentSearchSchema = z.object({
	search: z.string().optional(),
	page: z.coerce.number().default(1),
	size: z.coerce.number().default(10),
	sortBy: z.string().optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
	grade: z.string().optional(),
	classe: z.string().optional(),
	status: z.enum(["Active", "Inactive", "Pending", "New"]).optional(),
	gender: z.string().optional(),
});

export const createStudentSchema = z.object({
	name: z.string().min(2).max(50),
	email: z.string().email(),
	password: z.string().min(8),
	grade: z.string().optional(),
	classe: z.string().optional(),
	parentPhoneNumber: z.string().optional(),
	parentName: z.string().optional(),
	status: z.enum(["Active", "Inactive", "Pending", "New"]).optional(),
	gender: z.string().optional(),
	address: z.string().optional(),
	dateOfBirth: z.string().optional(),
});

export const updateStudentSchema = createStudentSchema.omit({
	email: true,
	password: true,
}).partial();

export type CreateStudentBody = z.infer<typeof createStudentSchema>;
export type UpdateStudentBody = z.infer<typeof updateStudentSchema>;
export type StudentSearchSchema = z.infer<typeof StudentSearchSchema>;
