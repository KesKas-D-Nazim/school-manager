import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

import type * as schema from "./db/schema.js";

export type Db = LibSQLDatabase<typeof schema>;

export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

export type Student = InferSelectModel<typeof schema.students>;
export type NewStudent = InferInsertModel<typeof schema.students>;

export type Teacher = InferSelectModel<typeof schema.teachers>;
export type NewTeacher = InferInsertModel<typeof schema.teachers>;

export type Course = InferSelectModel<typeof schema.courses>;
export type NewCourse = InferInsertModel<typeof schema.courses>;

export type Enrollment = InferSelectModel<typeof schema.enrollments>;
export type NewEnrollment = InferInsertModel<typeof schema.enrollments>;

export type Reference = InferSelectModel<typeof schema.references>;
export type NewReference = InferInsertModel<typeof schema.references>;

export type File = InferSelectModel<typeof schema.files>;
export type NewFile = InferInsertModel<typeof schema.files>;

export type Event = InferSelectModel<typeof schema.events>;
export type NewEvent = InferInsertModel<typeof schema.events>;

export type Assignment = InferSelectModel<typeof schema.assignments>;
export type NewAssignment = InferInsertModel<typeof schema.assignments>;

export type CourseFile = InferSelectModel<typeof schema.courseFiles>;
export type NewCourseFile = InferInsertModel<typeof schema.courseFiles>;

export type AssignmentFile = InferSelectModel<typeof schema.assignmentFiles>;
export type NewAssignmentFile = InferInsertModel<typeof schema.assignmentFiles>;

export type Notification = InferSelectModel<typeof schema.notifications>;
export type NewNotification = InferInsertModel<typeof schema.notifications>;

export type NotificationFile = InferSelectModel<typeof schema.notificationFiles>;
export type NewNotificationFile = InferInsertModel<typeof schema.notificationFiles>;
