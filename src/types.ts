import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import type * as schema from "./db/schema.ts";
import z, { success } from "zod";

export type Db = NodePgDatabase<typeof schema>;

export type User = typeof schema.usersTable.$inferSelect;
export type NewUser = typeof schema.usersTable.$inferInsert;

export type Student = typeof schema.studentsTable.$inferSelect;
export type NewStudent = typeof schema.studentsTable.$inferInsert;

export type Teacher = typeof schema.teachersTable.$inferSelect;
export type NewTeacher = typeof schema.teachersTable.$inferInsert;

export type Course = typeof schema.coursesTable.$inferSelect;
export type NewCourse = typeof schema.coursesTable.$inferInsert;

export type Enrollment = typeof schema.enrollmentsTable.$inferSelect;
export type NewEnrollment = typeof schema.enrollmentsTable.$inferInsert;

export type Reference = typeof schema.referencesTable.$inferSelect;
export type NewReference = typeof schema.referencesTable.$inferInsert;

export type File = typeof schema.filesTable.$inferSelect;
export type NewFile = typeof schema.filesTable.$inferInsert;

export type Event = typeof schema.eventsTable.$inferSelect;
export type NewEvent = typeof schema.eventsTable.$inferInsert;

export type Assignment = typeof schema.assignmentsTable.$inferSelect;
export type NewAssignment = typeof schema.assignmentsTable.$inferInsert;

export type CourseFile = typeof schema.courseFilesTable.$inferSelect;
export type NewCourseFile = typeof schema.courseFilesTable.$inferInsert;

export type AssignmentFile = typeof schema.assignmentFilesTable.$inferSelect;
export type NewAssignmentFile = typeof schema.assignmentFilesTable.$inferInsert;

export type Notification = typeof schema.notificationsTable.$inferSelect;
export type NewNotification = typeof schema.notificationsTable.$inferInsert;

export type NotificationFile = typeof schema.notificationFilesTable.$inferSelect;
export type NewNotificationFile = typeof schema.notificationFilesTable.$inferInsert;


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
    search: z.string().optional(),
    page: z.number().int().optional(),
    size: z.number().int().optional(),
    email: z.email().optional(),
    name: z.string().optional(),
    id: z.string().optional(),
});

export const studentSearchSchema = userSearchSchema.extend({
    grade: z.string().optional(),
    status: z.string()
});

export const teacherSearchSchema = userSearchSchema.extend({
    subject: z.string().optional(),
});

export type UserSearchSchema = z.infer<typeof userSearchSchema>;
export type StudentSearchSchema = z.infer<typeof studentSearchSchema>;
export type TeacherSearchSchema = z.infer<typeof teacherSearchSchema>;