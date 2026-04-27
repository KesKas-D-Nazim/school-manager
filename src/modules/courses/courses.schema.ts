import z from "zod";

export const CourseSearchSchema = z.object({
	search: z.string().optional(),
	page: z.coerce.number().default(1),
	size: z.coerce.number().default(10),
	teacherId: z.string().optional(),
});

export const createCourseSchema = z.object({
	name: z.string().min(2).max(120),
	description: z.string().optional(),
	teacherId: z.string().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseBody = z.infer<typeof createCourseSchema>;
export type UpdateCourseBody = z.infer<typeof updateCourseSchema>;
export type CourseSearchSchema = z.infer<typeof CourseSearchSchema>;
