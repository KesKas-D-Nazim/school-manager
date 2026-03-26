import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { teachers } from "../schema.js";
export async function createTeacher(data) {
    const [row] = await db.insert(teachers).values(data).returning();
    return row;
}
export async function findTeacherById(id) {
    return db.query.teachers.findFirst({
        where: eq(teachers.id, id),
    });
}
export async function findTeacherByUserId(userId) {
    return db.query.teachers.findFirst({
        where: eq(teachers.userId, userId),
    });
}
