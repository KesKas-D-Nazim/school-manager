import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { notifications } from "../schema.js";
export async function createNotification(data) {
    const [row] = await db.insert(notifications).values(data).returning();
    return row;
}
export async function findNotificationById(id) {
    return db.query.notifications.findFirst({
        where: eq(notifications.id, id),
    });
}
export async function listNotificationsByUserId(userId) {
    return db.query.notifications.findMany({
        where: eq(notifications.usersId, userId),
    });
}
