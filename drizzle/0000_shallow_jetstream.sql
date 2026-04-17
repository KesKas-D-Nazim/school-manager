CREATE TYPE "public"."gender" AS ENUM('Male', 'Female');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Student', 'Teacher', 'Admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Active', 'Inactive', 'Pending', 'New');--> statement-breakpoint
CREATE TABLE "admins" (
	"school_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"school_name" varchar(120) NOT NULL,
	"number_students" integer DEFAULT 0 NOT NULL,
	"number_teachers" integer DEFAULT 0 NOT NULL,
	"school_icon_file_id" uuid,
	CONSTRAINT "admins_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid NOT NULL,
	"user_id" text,
	"grade" varchar(20) NOT NULL,
	"classe" varchar(40) NOT NULL,
	"parent_phone_number" varchar(20) NOT NULL,
	"parent_name" varchar(120) NOT NULL,
	"status" "status" DEFAULT 'New' NOT NULL,
	"gender" "gender" NOT NULL,
	"address" text NOT NULL,
	"date_of_birth" varchar(20) NOT NULL,
	CONSTRAINT "students_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid NOT NULL,
	"user_id" text,
	"gender" varchar(20),
	"number" varchar(20),
	"address" text,
	"subjects" text,
	"date_of_birth" varchar(20),
	"joining_date" varchar(20),
	"status" "status" DEFAULT 'New' NOT NULL,
	"teacher_picture_file_id" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"password_hash" varchar(255) NOT NULL,
	"username" varchar(50) NOT NULL,
	"tel_number" varchar(20) NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;