import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { students } from "../schema.js";
export async function createStudent(data) {
    const [row] = await db.insert(students).values(data).returning();
    return row;
}
export async function findStudentById(id) {
    return db.query.students.findFirst({
        where: eq(students.id, id),
    });
}
export async function findStudentByUserId(userId) {
    return db.query.students.findFirst({
        where: eq(students.userId, userId),
    });
}
