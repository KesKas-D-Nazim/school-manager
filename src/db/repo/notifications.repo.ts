import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { notifications } from "../schema.js";
import type { NewNotification, Notification } from "../../types.js";

export async function createNotification(
  data: NewNotification,
): Promise<Notification> {
  const [row] = await db.insert(notifications).values(data).returning();
  return row;
}

export async function findNotificationById(
  id: number,
): Promise<Notification | undefined> {
  const [row] = await db.select().from(notifications).where(eq(notifications.id, id));
  return row;
}

export async function listNotificationsByUserId(
  userId: number,
): Promise<Notification[]> {
  return db.select().from(notifications).where(eq(notifications.usersId, userId));
}
