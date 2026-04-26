import "dotenv/config";
import { db } from "./db/db";
import { users } from "./db/schemas";
import { adminsTable } from "./db/schemas";
import { coursesTable } from "./db/schemas";

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Create a user (admin owner)
  const userId = "user_1";

  await db.insert(users).values({
    id: userId,
    email: "admin@test.com",
    emailVerified: true,
    image: null,
    name: "Admin",
    telNumber: "0000000000",
    role: "admin",
  });

  console.log("👤 User created");

  // 2. Create school/admin
  const schoolId = "school_1";

  await db.insert(adminsTable).values({
    id: schoolId,
    userId: userId,
    schoolName: "Test School",
    numberStudents: 0,
    numberTeachers: 0,
    schoolIconFileId: null,
  });

  console.log("🏫 Admin created");

  // 3. Create courses
  await db.insert(coursesTable).values([
    {
      id: "course_1",
      schoolId: schoolId,
      name: "Math 101",
      description: "Basic algebra and equations",
      teacherId: null,
    },
    {
      id: "course_2",
      schoolId: schoolId,
      name: "Physics 101",
      description: "Intro to mechanics",
      teacherId: null,
    },
  ]);

  console.log("📚 Courses created");

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});