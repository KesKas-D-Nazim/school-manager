import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { users } from "../schema.js";
export async function createUser(data) {
    const [row] = await db.insert(users).values(data).returning();
    return row;
}
export async function findUserById(id) {
    return db.query.users.findFirst({
        where: eq(users.id, id),
    });
}
export async function findUserByEmail(email) {
    return db.query.users.findFirst({
        where: eq(users.email, email),
    });
}
export async function findUserByUsername(username) {
    return db.query.users.findFirst({
        where: eq(users.username, username),
    });
}
