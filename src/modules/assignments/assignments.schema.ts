import z from "zod";

export const createAssignmentSchema = z.object({
	courseId: z.string().min(1),
	title: z.string().min(1).max(160),
	description: z.string().optional(),
	deadline: z.string().min(1),
});

export const updateAssignmentSchema = createAssignmentSchema.partial();

export type CreateAssignmentBody = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentBody = z.infer<typeof updateAssignmentSchema>;
