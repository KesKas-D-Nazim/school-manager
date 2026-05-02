import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../src/db/schemas.js"

import z from "zod";

export type Db = NodePgDatabase<typeof schema>;

export type User = typeof schema.users.$inferSelect;
export type NewUser = typeof schema.users.$inferInsert;

export type Student = typeof schema.studentsTable.$inferSelect;
export type NewStudent = Omit<typeof schema.studentsTable.$inferInsert, "id"> & { id?: string };

export type Teacher = typeof schema.teachersTable.$inferSelect;
export type NewTeacher = Omit<typeof schema.teachersTable.$inferInsert, "id"> & { id?: string };

export type Course = typeof schema.coursesTable.$inferSelect;
export type NewCourse = Omit<typeof schema.coursesTable.$inferInsert, "id"> & { id?: string };

export type Enrollment = typeof schema.enrollmentsTable.$inferSelect;
export type NewEnrollment = Omit<typeof schema.enrollmentsTable.$inferInsert, "id"> & { id?: string };

export type Reference = typeof schema.referencesTable.$inferSelect;
export type NewReference = Omit<typeof schema.referencesTable.$inferInsert, "id"> & { id?: string };

export type File = typeof schema.filesTable.$inferSelect;
export type NewFile = Omit<typeof schema.filesTable.$inferInsert, "id"> & { id?: string };

export type Event = typeof schema.eventsTable.$inferSelect;
export type NewEvent = Omit<typeof schema.eventsTable.$inferInsert, "id"> & { id?: string };

export type Assignment = typeof schema.assignmentsTable.$inferSelect;
export type NewAssignment = typeof schema.assignmentsTable.$inferInsert;

export type CourseFile = typeof schema.courseFilesTable.$inferSelect;
export type NewCourseFile = Omit<typeof schema.courseFilesTable.$inferInsert, "id"> & { id?: string };

export type AssignmentFile = typeof schema.assignmentFilesTable.$inferSelect;
export type NewAssignmentFile = Omit<typeof schema.assignmentFilesTable.$inferInsert, "id"> & { id?: string };

export type Notification = typeof schema.notificationsTable.$inferSelect;
export type NewNotification = Omit<typeof schema.notificationsTable.$inferInsert, "id"> & { id?: string };

export type NotificationFile = typeof schema.notificationFilesTable.$inferSelect;
export type NewNotificationFile = Omit<typeof schema.notificationFilesTable.$inferInsert, "id"> & { id?: string };



// export const searchSchema = z.object({
//     search: z.string().optional(),
//     page: z.string().optional(),
//     limit: z.string().optional(),
// });

// export type SearchSchema = z.infer<typeof searchSchema>;

// export const userSearchSchema = z.object({
//     search: z.string().optional().default(""),
//     page: z.coerce.number().int().optional().default(1),
//     size: z.coerce.number().int().optional().default(10),
//     sortBy: z.enum(['name', 'email']).default('name'),
//     sortOrder: z.enum(['asc', 'desc']).nullable().default('asc')
// });

// export const studentSearchSchema = userSearchSchema.extend({
//     grade: z.string().optional(),
//     status: z.string(),
//     schoolId: z.string().optional() // this shouldn't be in here because those search parameters are in the front end and this shouldn't be shown in the front end 
// });

// export const teacherSearchSchema = userSearchSchema.extend({
//     subject: z.string().optional(),
// });

// export type UserSearchSchema = z.infer<typeof userSearchSchema>;
// export type StudentSearchSchema = z.infer<typeof studentSearchSchema>;
// export type TeacherSearchSchema = z.infer<typeof teacherSearchSchema>;

export const validUUIDSchema = z.string().uuid();



// this is ayoub code i know it needs some changes but it's first step
// those are essential for returning the status code of the response


// export type successResponse<T> = {
//     success: true;
//     data: T;
// };

// export type errorResponse = {
//     success: false;
//     error: string;
// };

// export type ApiResponse<T> = successResponse<T> | errorResponse;

// export type PaginatedSuccessResponse<T> = successResponse<T> & {
//     pagination: {
//         page: number;
//         pageSize: number;
//     };
// };

// export type PaginatedApiResponse<T> = PaginatedSuccessResponse<T> | errorResponse;

export const searchSchema = z.object({
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
});

export type SearchSchema = z.infer<typeof searchSchema>;

export const userSearchSchema = z.object({
    search: z.string().optional().default(""),
    page: z.number().int().optional().default(1),
    size: z.number().int().optional().default(10),
    sortBy: z.enum(['name', 'email']).default('name'),
    sortOrder: z.enum(['asc', 'desc']).nullable().default('asc')
});

export const studentSearchSchema = userSearchSchema.extend({
    grade: z.string().optional(),
    status: z.string(),
    schoolId: z.string().optional()
});

export const teacherSearchSchema = userSearchSchema.extend({
    subject: z.string().optional(),
});

export type UserSearchSchema = z.infer<typeof userSearchSchema>;
export type StudentSearchSchema = z.infer<typeof studentSearchSchema>;
export type TeacherSearchSchema = z.infer<typeof teacherSearchSchema>;

