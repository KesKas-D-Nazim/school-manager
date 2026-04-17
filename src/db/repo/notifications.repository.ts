// import { eq } from "drizzle-orm";

// import { db } from "../db.js";
// import { notificationsTable } from "../schemas.js";
// import type { NewNotification, Notification } from "../../types.js";

// export async function createNotification(
//   data: NewNotification,
// ): Promise<Notification> {
//   const [row] = await db.insert(notificationsTable).values(data).returning();
//   return row;
// }

// export async function findNotificationById(
//   id: string,
// ): Promise<Notification | undefined> {
//   return db.query.notificationsTable.findFirst({
//     where: eq(notificationsTable.id, id),
//   });
// }

// export async function listNotificationsByUserId(
//   userId: string,
// ): Promise<Notification[]> {
//   return db.query.notificationsTable.findMany({
//     where: eq(notificationsTable.usersId, userId),
//   });
// }
