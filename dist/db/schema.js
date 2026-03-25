import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password"),
    age: integer("age"),
    telNumber: text("tel_number"),
    role: text("role", { enum: ["student", "teacher", "owner"] }).notNull(),
    createdAt: text("created_at").notNull().default(new Date().toISOString()),
});
export const courses = sqliteTable("courses", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: text("created_at").notNull().default(new Date().toISOString()),
});
export const files = sqliteTable("files", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    key: text("key").notNull().unique(),
    extension: text("extension").notNull(),
    uploadedAt: text("uploaded_at").notNull().default(new Date().toISOString()),
});
export const references = sqliteTable("references", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    courseId: integer("course_id")
        .notNull()
        .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    url: text("url").notNull(),
    createdAt: text("created_at").notNull().default(new Date().toISOString()),
});
export const assignments = sqliteTable("assignments", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    courseId: integer("course_id")
        .notNull()
        .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    deadline: text("deadline").notNull(),
    createdAt: text("created_at").notNull().default(new Date().toISOString()),
});
export const assignmentFiles = sqliteTable("assignment_files", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    assignmentId: integer("assignment_id")
        .notNull()
        .references(() => assignments.id, { onDelete: "cascade" }),
    fileId: integer("file_id")
        .notNull()
        .references(() => files.id, { onDelete: "cascade" }),
});
export const assignmentSubmissions = sqliteTable("assignment_submissions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    assignmentId: integer("assignment_id")
        .notNull()
        .references(() => assignments.id, { onDelete: "cascade" }),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    fileId: integer("file_id")
        .notNull()
        .references(() => files.id, { onDelete: "cascade" }),
    submittedAt: text("submitted_at").notNull().default(new Date().toISOString()),
});
export const courseFiles = sqliteTable("course_files", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    courseId: integer("course_id")
        .notNull()
        .references(() => courses.id, { onDelete: "cascade" }),
    fileId: integer("file_id")
        .notNull()
        .references(() => files.id, { onDelete: "cascade" }),
});
export const enrollments = sqliteTable("enrollments", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
        .notNull()
        .references(() => courses.id, { onDelete: "cascade" }),
    enrolledAt: text("enrolled_at").notNull().default(new Date().toISOString()),
});
export const events = sqliteTable("events", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    courseId: integer("course_id").references(() => courses.id, {
        onDelete: "cascade",
    }),
    title: text("title").notNull(),
    description: text("description"),
    type: text("type", { enum: ["class", "exam", "event", "holiday"] }).notNull(),
    date: text("date").notNull(),
    createdAt: text("created_at").notNull().default(new Date().toISOString()),
});
