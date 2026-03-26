import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  username: text("username").notNull().unique(),
  telNumber: text("tel_number"),
  role: text("role", { enum: ["student", "teacher", "owner"] }).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  teacher: one(teachers, {
    fields: [users.id],
    references: [teachers.userId],
  }),
  notifications: many(notifications),
}));

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  grade: text("grade"),
  classe: text("classe"),
  parentPhoneNumber: text("parent_phone_number"),
  parentName: text("parent_name"),
  status: text("status"),
  gender: text("gender"),
  address: text("address"),
  dateOfBirth: text("date_of_birth"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  enrollments: many(enrollments),
}));

export const teachers = sqliteTable("teachers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  gender: text("gender"),
  number: text("number"),
  address: text("address"),
  subjects: text("subjects"),
  dateOfBirth: text("date_of_birth"),
  joiningDate: text("joining_date"),
  status: text("status", { enum: ["Active", "Inactive", "Pending", "New"] }),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  courses: many(courses),
}));

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  teacherId: integer("teacher_id")
    .references(() => teachers.id, { onDelete: "set null" }),
});

export const coursesRelations = relations(courses, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [courses.teacherId],
    references: [teachers.id],
  }),
  enrollments: many(enrollments),
  references: many(references),
  assignments: many(assignments),
  events: many(events),
  files: many(courseFiles),
}));

export const enrollments = sqliteTable("enrollments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  enrolledAt: text("enrolled_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const references = sqliteTable("references", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const referencesRelations = relations(references, ({ one }) => ({
  course: one(courses, {
    fields: [references.courseId],
    references: [courses.id],
  }),
}));

export const files = sqliteTable("files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  extension: text("extension").notNull(),
  uploadedAt: text("uploaded_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const filesRelations = relations(files, ({ many }) => ({
  courseFiles: many(courseFiles),
  assignmentFiles: many(assignmentFiles),
  notificationFiles: many(notificationFiles),
}));

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courseId: integer("course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type", { enum: ["class", "exam", "event", "holiday"] }).notNull(),
  date: text("date").notNull(),
  className: text("class_name"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const eventsRelations = relations(events, ({ one }) => ({
  course: one(courses, {
    fields: [events.courseId],
    references: [courses.id],
  }),
}));

export const assignments = sqliteTable("assignments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  deadline: text("deadline").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  course: one(courses, {
    fields: [assignments.courseId],
    references: [courses.id],
  }),
  files: many(assignmentFiles),
}));

export const courseFiles = sqliteTable("course_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  fileId: integer("file_id")
    .notNull()
    .references(() => files.id, { onDelete: "cascade" }),
});

export const courseFilesRelations = relations(courseFiles, ({ one }) => ({
  course: one(courses, {
    fields: [courseFiles.courseId],
    references: [courses.id],
  }),
  file: one(files, {
    fields: [courseFiles.fileId],
    references: [files.id],
  }),
}));

export const assignmentFiles = sqliteTable("assignment_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  assignmentId: integer("assignment_id")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  fileId: integer("file_id")
    .notNull()
    .references(() => files.id, { onDelete: "cascade" }),
});

export const assignmentFilesRelations = relations(assignmentFiles, ({ one }) => ({
  assignment: one(assignments, {
    fields: [assignmentFiles.assignmentId],
    references: [assignments.id],
  }),
  file: one(files, {
    fields: [assignmentFiles.fileId],
    references: [files.id],
  }),
}));

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usersId: integer("users_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  sendTo: text("send_to").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const notificationsRelations = relations(notifications, ({ one, many }) => ({
  user: one(users, {
    fields: [notifications.usersId],
    references: [users.id],
  }),
  files: many(notificationFiles),
}));

export const notificationFiles = sqliteTable("notification_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  notificationId: integer("notification_id")
    .notNull()
    .references(() => notifications.id, { onDelete: "cascade" }),
  fileId: integer("file_id")
    .notNull()
    .references(() => files.id, { onDelete: "cascade" }),
});

export const notificationFilesRelations = relations(
  notificationFiles,
  ({ one }) => ({
    notification: one(notifications, {
      fields: [notificationFiles.notificationId],
      references: [notifications.id],
    }),
    file: one(files, {
      fields: [notificationFiles.fileId],
      references: [files.id],
    }),
  }),
);
