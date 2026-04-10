import { text, uuid, pgTable, pgEnum, timestamp, integer, varchar, boolean, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// * enums : 
export const roleEnum = pgEnum("role", ["student", "teacher", "owner"]);
export const statusEnum = pgEnum("status", ["Active", "Inactive", "Pending", "New"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  username: varchar("username", { length: 50 }).notNull(),
  displayUsername: text("display_username"),
  telNumber: varchar("tel_number", { length: 20 }),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  student: one(studentsTable, {
    fields: [users.id],
    references: [studentsTable.userId],
  }),
  teacher: one(teachersTable, {
    fields: [users.id],
    references: [teachersTable.userId],
  }),
  admin: one(adminsTable, {
    fields: [users.id],
    references: [adminsTable.userId],
  }),
  sessions: many(session),
  accounts: many(account),
  notifications: many(notificationsTable),
}));

export const adminsTable = pgTable("admins", {
  id: uuid("school_id").notNull().primaryKey(),
  userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  schoolName: varchar("school_name", { length: 120 }).notNull(),
  numberStudents: integer("number_students").notNull().default(0),
  numberTeachers: integer("number_teachers").notNull().default(0),
  schoolIconFileId: uuid("school_icon_file_id").references(() => filesTable.id, { onDelete: "set null" }),
});

export const adminsRelations = relations(adminsTable, ({ one }) => ({
  user: one(users, {
    fields: [adminsTable.userId],
    references: [users.id],
  }),
  schoolIconFile: one(filesTable, {
    fields: [adminsTable.schoolIconFileId],
    references: [filesTable.id],
  }),
}));

export const studentsTable = pgTable("students", {
  id: uuid("id").notNull().primaryKey(),
  schoolId: uuid("school_id").notNull().references(() => adminsTable.id, { onDelete: "cascade" }),
  userId: uuid("user_id").unique().references(() => users.id, { onDelete: "cascade" }),
  grade: varchar("grade", { length: 20 }),
  classe: varchar("classe", { length: 40 }),
  parentPhoneNumber: varchar("parent_phone_number", { length: 20 }),
  parentName: varchar("parent_name", { length: 120 }),
  status: statusEnum("status").notNull().default("New"),
  gender: varchar("gender", { length: 20 }),
  address: text("address"),
  dateOfBirth: varchar("date_of_birth", { length: 20 }),
  studentPictureFileId: uuid("student_picture_file_id").references(() => filesTable.id, { onDelete: "set null" }),
});

export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
  user: one(users, {
    fields: [studentsTable.userId],
    references: [users.id],
  }),
  enrollments: many(enrollmentsTable),
  studentPictureFile: one(filesTable, {
    fields: [studentsTable.studentPictureFileId],
    references: [filesTable.id],
  }),
}));

export const teachersTable = pgTable("teachers", {
  id: uuid("id").notNull().primaryKey(),
  schoolId: uuid("school_id").notNull().references(() => adminsTable.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  gender: varchar("gender", { length: 20 }),
  telNumber: varchar("number", { length: 20 }),
  address: text("address"),
  subjects: text("subjects"),
  dateOfBirth: varchar("date_of_birth", { length: 20 }),
  joiningDate: varchar("joining_date", { length: 20 }),
  status: statusEnum("status").notNull().default("New"),
  teacherPictureFileId: uuid("teacher_picture_file_id").references(() => filesTable.id, { onDelete: "set null" }),
});

export const teachersRelations = relations(teachersTable, ({ one, many }) => ({
  user: one(users, {
    fields: [teachersTable.userId],
    references: [users.id],
  }),
  courses: many(coursesTable),
  teacherPictureFile: one(filesTable, {
    fields: [teachersTable.teacherPictureFileId],
    references: [filesTable.id],
  }),
}));

export const coursesTable = pgTable("courses", {
  id: uuid("id").notNull().primaryKey(),
  schoolId: uuid("school_id").notNull().references(() => adminsTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  schoolId: uuid("school_id").notNull().references(() => adminsTable.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").references(() => studentsTable.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").references(() => coursesTable.id, { onDelete: "cascade" }),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
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
  title: varchar("title", { length: 160 }).notNull(),
  url: varchar("url", { length: 2048 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const referencesRelations = relations(referencesTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [referencesTable.courseId],
    references: [coursesTable.id],
  }),
}));

export const filesTable = pgTable("files", {
  id: uuid("id").notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  key: varchar("key", { length: 512 }).notNull().unique(),
  extension: varchar("extension", { length: 20 }).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const filesRelations = relations(filesTable, ({ many }) => ({
  courseFiles: many(courseFilesTable),
  assignmentFiles: many(assignmentFilesTable),
  notificationFiles: many(notificationFilesTable),
  adminSchoolIcons: many(adminsTable),
  studentPictures: many(studentsTable),
  teacherPictures: many(teachersTable),
}));

export const eventsTable = pgTable("events", {
  id: uuid("id").notNull().primaryKey(),
  schoolId: uuid("school_id").notNull().references(() => adminsTable.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").references(() => coursesTable.id, {
    onDelete: "cascade",
  }),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  type: text("type", { enum: ["class", "exam", "event", "holiday"] }).notNull(),
  date: timestamp("date").notNull(),
  className: varchar("class_name", { length: 80 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventsRelations = relations(eventsTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [eventsTable.courseId],
    references: [coursesTable.id],
  }),
}));

export const assignmentsTable = pgTable("assignments", {
  id: uuid("id").notNull().primaryKey(),
  schoolId: uuid("school_id").notNull().references(() => adminsTable.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").references(() => coursesTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  deadline: timestamp("deadline").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  schoolId: uuid("school_id").notNull().references(() => adminsTable.id, { onDelete: "cascade" }),
  usersId: uuid("users_id").references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 160 }).notNull(),
  body: text("body").notNull(),
  sendTo: varchar("send_to", { length: 40 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationsRelations = relations(notificationsTable, ({ one, many }) => ({
  user: one(users, {
    fields: [notificationsTable.usersId],
    references: [users.id],
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

// * auth tables :
export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);



export const sessionRelations = relations(session, ({ one }) => ({
  users: one(users, {
    fields: [session.userId],
    references: [users.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  users: one(users, {
    fields: [account.userId],
    references: [users.id],
  }),
}));