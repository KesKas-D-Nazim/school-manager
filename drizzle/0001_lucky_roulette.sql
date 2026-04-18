ALTER TABLE "account" DROP CONSTRAINT IF EXISTS "account_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "admins" DROP CONSTRAINT IF EXISTS "admins_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT IF EXISTS "students_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT IF EXISTS "teachers_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "notifications_users_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_username_unique";
--> statement-breakpoint
ALTER TABLE "account"
ALTER COLUMN "id"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "account"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "account"
ALTER COLUMN "account_id"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "account"
ALTER COLUMN "provider_id"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "account"
ALTER COLUMN "user_id"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "admins"
ALTER COLUMN "user_id"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "assignment_files"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "assignments"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "course_files"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "courses"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "enrollments"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "events"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "files"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "notification_files"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "notifications"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "notifications"
ALTER COLUMN "users_id"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "references"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "session"
ALTER COLUMN "user_id"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "students"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "students"
ALTER COLUMN "user_id"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "teachers"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "teachers"
ALTER COLUMN "user_id"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "users"
ALTER COLUMN "id"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "users"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "verification"
ALTER COLUMN "id"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "verification"
ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "users"
ADD COLUMN "name" varchar(50);
--> statement-breakpoint
UPDATE "users"
SET "name" = COALESCE("username", split_part("email", '@', 1), 'user')
WHERE "name" IS NULL;
--> statement-breakpoint
ALTER TABLE "users"
ALTER COLUMN "name"
SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "username";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "display_username";
--> statement-breakpoint
ALTER TABLE "account"
ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admins"
ADD CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "session"
ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "students"
ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "teachers"
ADD CONSTRAINT "teachers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "notifications"
ADD CONSTRAINT "notifications_users_id_users_id_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;