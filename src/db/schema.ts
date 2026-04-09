import { text, uuid, pgTable } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: uuid("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  username: text("username").notNull().unique(),
  telNumber: text("tel_number"),
  role: text("role", { enum: ["student", "teacher", "owner"] }).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  student: one(studentsTable, {
    fields: [usersTable.id],
    references: [studentsTable.userId],
  }),
  teacher: one(teachersTable, {
    fields: [usersTable.id],
    references: [teachersTable.userId],
  }),
  notifications: many(notificationsTable),
}));

export const studentsTable = pgTable("students", {
  id: uuid("id").notNull().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
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

export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [studentsTable.userId],
    references: [usersTable.id],
  }),
  enrollments: many(enrollmentsTable),
}));

export const teachersTable = pgTable("teachers", {
  id: uuid("id").notNull().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  gender: text("gender"),
  number: text("number"),
  address: text("address"),
  subjects: text("subjects"),
  dateOfBirth: text("date_of_birth"),
  joiningDate: text("joining_date"),
  status: text("status", { enum: ["Active", "Inactive", "Pending", "New"] }),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const teachersRelations = relations(teachersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [teachersTable.userId],
    references: [usersTable.id],
  }),
  courses: many(coursesTable),
}));

export const coursesTable = pgTable("courses", {
  id: uuid("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  teacherId: uuid("teacher_id").references(() => teachersTable.id, { onDelete: "set null" }),
});

export const coursesRelations = relations(coursesTable, ({ one, many }) => ({
  teacher: one(teachersTable, {
    fields: [coursesTable.teacherId],
    references: [teachersTable.id],
  }),
  enrollments: many(enrollmentsTable),
  references: many(referencesTable),
  assignments: many(assignmentsTable),
  events: many(eventsTable),
  files: many(courseFilesTable),
}));

export const enrollmentsTable = pgTable("enrollments", {
  id: uuid("id").notNull().primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").references(() => coursesTable.id, { onDelete: "cascade" }),
  enrolledAt: text("enrolled_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const enrollmentsRelations = relations(enrollmentsTable, ({ one }) => ({
  student: one(studentsTable, {
    fields: [enrollmentsTable.studentId],
    references: [studentsTable.id],
  }),
  course: one(coursesTable, {
    fields: [enrollmentsTable.courseId],
    references: [coursesTable.id],
  }),
}));

export const referencesTable = pgTable("references", {
  id: uuid("id").notNull().primaryKey(),
  courseId: uuid("course_id").references(() => coursesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const referencesRelations = relations(referencesTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [referencesTable.courseId],
    references: [coursesTable.id],
  }),
}));

export const filesTable = pgTable("files", {
  id: uuid("id").notNull().primaryKey(),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  extension: text("extension").notNull(),
  uploadedAt: text("uploaded_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const filesRelations = relations(filesTable, ({ many }) => ({
  courseFiles: many(courseFilesTable),
  assignmentFiles: many(assignmentFilesTable),
  notificationFiles: many(notificationFilesTable),
}));

export const eventsTable = pgTable("events", {
  id: uuid("id").notNull().primaryKey(),
  courseId: uuid("course_id").references(() => coursesTable.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type", { enum: ["class", "exam", "event", "holiday"] }).notNull(),
  date: text("date").notNull(),
  className: text("class_name"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const eventsRelations = relations(eventsTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [eventsTable.courseId],
    references: [coursesTable.id],
  }),
}));

export const assignmentsTable = pgTable("assignments", {
  id: uuid("id").notNull().primaryKey(),
  courseId: uuid("course_id").references(() => coursesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  deadline: text("deadline").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const assignmentsRelations = relations(assignmentsTable, ({ one, many }) => ({
  course: one(coursesTable, {
    fields: [assignmentsTable.courseId],
    references: [coursesTable.id],
  }),
  files: many(assignmentFilesTable),
}));

export const courseFilesTable = pgTable("course_files", {
  id: uuid("id").notNull().primaryKey(),
  courseId: uuid("course_id").references(() => coursesTable.id, { onDelete: "cascade" }),
  fileId: uuid("file_id").notNull().references(() => filesTable.id, { onDelete: "cascade" }),
});

export const courseFilesRelations = relations(courseFilesTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [courseFilesTable.courseId],
    references: [coursesTable.id],
  }),
  file: one(filesTable, {
    fields: [courseFilesTable.fileId],
    references: [filesTable.id],
  }),
}));

export const assignmentFilesTable = pgTable("assignment_files", {
  id: uuid("id").notNull().primaryKey(),
  assignmentId: uuid("assignment_id").references(() => assignmentsTable.id, { onDelete: "cascade" }),
  fileId: uuid("file_id").notNull().references(() => filesTable.id, { onDelete: "cascade" }),
});

export const assignmentFilesRelations = relations(assignmentFilesTable, ({ one }) => ({
  assignment: one(assignmentsTable, {
    fields: [assignmentFilesTable.assignmentId],
    references: [assignmentsTable.id],
  }),
  file: one(filesTable, {
    fields: [assignmentFilesTable.fileId],
    references: [filesTable.id],
  }),
}));

export const notificationsTable = pgTable("notifications", {
  id: uuid("id").notNull().primaryKey(),
  usersId: uuid("users_id").references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  sendTo: text("send_to").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const notificationsRelations = relations(notificationsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [notificationsTable.usersId],
    references: [usersTable.id],
  }),
  files: many(notificationFilesTable),
}));

export const notificationFilesTable = pgTable("notification_files", {
  id: uuid("id").notNull().primaryKey(),
  notificationId: uuid("notification_id").notNull().references(() => notificationsTable.id, { onDelete: "cascade" }),
  fileId: uuid("file_id").references(() => filesTable.id, { onDelete: "cascade" }),
});

export const notificationFilesRelations = relations(notificationFilesTable, ({ one }) => ({
  notification: one(notificationsTable, {
    fields: [notificationFilesTable.notificationId],
    references: [notificationsTable.id],
  }),
  file: one(filesTable, {
    fields: [notificationFilesTable.fileId],
    references: [filesTable.id],
  }),
}),
);
