import { eq, like } from "drizzle-orm";

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
  return db.query.notifications.findFirst({
    where: eq(notifications.id, id),
  });
}

export async function listNotificationsByUserId(
  userId: number,
): Promise<Notification[]> {
  return db.query.notifications.findMany({
    where: eq(notifications.usersId, userId),
  });
}

export async function listNotificationsForStudent(classe: string) {
  return db.query.notifications.findMany({
    where: like(notifications.sendTo, `%${classe}%`),
    with: {
      files: { with: { file: true } },
    },
  });
}
