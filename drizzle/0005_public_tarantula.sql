ALTER TABLE "admins" ALTER COLUMN "school_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "school_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "school_icon_file_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "assignment_files" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "assignment_files" ALTER COLUMN "assignment_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "assignment_files" ALTER COLUMN "file_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "assignments" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "assignments" ALTER COLUMN "school_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "assignments" ALTER COLUMN "course_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "course_files" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "course_files" ALTER COLUMN "course_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "course_files" ALTER COLUMN "file_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "school_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "teacher_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "school_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "student_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "course_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "school_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "course_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notification_files" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notification_files" ALTER COLUMN "notification_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notification_files" ALTER COLUMN "file_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "school_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "references" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "references" ALTER COLUMN "course_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "school_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "student_picture_file_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "school_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "teacher_picture_file_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_date" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "all_day" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "is_class" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "repeat_weekly" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "teacher_id" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "color" varchar(20);--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "type" text;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "read" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "type";