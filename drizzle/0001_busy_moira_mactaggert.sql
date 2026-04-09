CREATE TYPE "public"."role" AS ENUM('student', 'teacher', 'owner');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Active', 'Inactive', 'Pending', 'New');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"school_id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"school_name" varchar(120) NOT NULL,
	"number_students" integer DEFAULT 0 NOT NULL,
	"number_teachers" integer DEFAULT 0 NOT NULL,
	"school_icon_file_id" uuid,
	CONSTRAINT "admins_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assignments" ALTER COLUMN "title" SET DATA TYPE varchar(160);--> statement-breakpoint
ALTER TABLE "assignments" ALTER COLUMN "deadline" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "assignments" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "assignments" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "name" SET DATA TYPE varchar(120);--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "enrolled_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "enrolled_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "title" SET DATA TYPE varchar(160);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "class_name" SET DATA TYPE varchar(80);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "key" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "extension" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "uploaded_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "uploaded_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "title" SET DATA TYPE varchar(160);--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "send_to" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "references" ALTER COLUMN "title" SET DATA TYPE varchar(160);--> statement-breakpoint
ALTER TABLE "references" ALTER COLUMN "url" SET DATA TYPE varchar(2048);--> statement-breakpoint
ALTER TABLE "references" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "references" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "grade" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "classe" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "parent_phone_number" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "parent_name" SET DATA TYPE varchar(120);--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "status" SET DEFAULT 'New'::"public"."status";--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "gender" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "date_of_birth" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "gender" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "number" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "date_of_birth" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "joining_date" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "status" SET DEFAULT 'New'::"public"."status";--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "tel_number" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "school_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "school_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "school_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "school_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "school_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "school_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "student_picture_file_id" uuid;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "school_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "teacher_picture_file_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_hash" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "display_username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_school_icon_file_id_files_id_fk" FOREIGN KEY ("school_icon_file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_student_picture_file_id_files_id_fk" FOREIGN KEY ("student_picture_file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_teacher_picture_file_id_files_id_fk" FOREIGN KEY ("teacher_picture_file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_unique" UNIQUE("user_id");