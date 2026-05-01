import { and, eq, ilike, sql } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

import { db, type Database } from "../db.js";
import {
  filesTable,
  notificationFilesTable,
  notificationsTable,
  users,
} from "../schemas.js";
import type { NewNotification, Notification } from "../../types.js";

export type NotificationWithRelations = Notification & {
  files: Array<InferSelectModel<typeof notificationFilesTable> & {
    file: InferSelectModel<typeof filesTable> | null;
  }>;
  user: InferSelectModel<typeof users> | null;
};

export interface INotificationsRepository {
  createNotification(data: NewNotification): Promise<Notification[]>;
  findNotificationById(id: string): Promise<NotificationWithRelations | undefined>;
  listNotificationsByUserId(
    userId: string,
    schoolId: string,
  ): Promise<{ data: NotificationWithRelations[]; pagination: { totalCount: number; totalPages: number } }>;
  listAllNotifications(
    schoolId: string,
  ): Promise<{ data: NotificationWithRelations[]; pagination: { totalCount: number; totalPages: number } }>;
  listNotificationsForStudent(
    classe: string,
    schoolId: string,
  ): Promise<NotificationWithRelations[]>;
  deleteNotification(id: string): Promise<Notification | undefined>;
}

class NotificationsRepository implements INotificationsRepository {
  constructor(private readonly db: Database) { }

  async createNotification(data: NewNotification): Promise<Notification[]> {
    const payload = { ...data, id: data.id ?? crypto.randomUUID() };
    const rows = await this.db.insert(notificationsTable).values(payload).returning();
    return rows;
  }

  async findNotificationById(id: string): Promise<NotificationWithRelations | undefined> {
    return this.db.query.notificationsTable.findFirst({
      where: eq(notificationsTable.id, id),
      with: {
        files: { with: { file: true } },
        user: true,
      },
    }) as Promise<NotificationWithRelations | undefined>;
  }

  async listNotificationsByUserId(
    userId: string,
    schoolId: string,
  ): Promise<{ data: NotificationWithRelations[]; pagination: { totalCount: number; totalPages: number } }> {
    const whereClause = and(
      eq(notificationsTable.usersId, userId),
      eq(notificationsTable.schoolId, schoolId),
    );

    const [totalRow] = await this.db
      .select({ total: sql<number>`count(*)` })
      .from(notificationsTable)
      .where(whereClause);
    const totalCount = Number(totalRow?.total ?? 0);
    const totalPages = totalCount > 0 ? 1 : 0;

    const data = await this.db.query.notificationsTable.findMany({
      where: whereClause,
      with: {
        files: { with: { file: true } },
        user: true,
      },
    });

    return {
      data: data as NotificationWithRelations[],
      pagination: { totalCount, totalPages },
    };
  }

  async listAllNotifications(
    schoolId: string,
  ): Promise<{ data: NotificationWithRelations[]; pagination: { totalCount: number; totalPages: number } }> {
    const whereClause = eq(notificationsTable.schoolId, schoolId);

    const [totalRow] = await this.db
      .select({ total: sql<number>`count(*)` })
      .from(notificationsTable)
      .where(whereClause);
    const totalCount = Number(totalRow?.total ?? 0);
    const totalPages = totalCount > 0 ? 1 : 0;

    const data = await this.db.query.notificationsTable.findMany({
      where: whereClause,
      with: {
        files: { with: { file: true } },
        user: true,
      },
    });

    return {
      data: data as NotificationWithRelations[],
      pagination: { totalCount, totalPages },
    };
  }

  async listNotificationsForStudent(
    classe: string,
    schoolId: string,
  ): Promise<NotificationWithRelations[]> {
    return this.db.query.notificationsTable.findMany({
      where: and(
        ilike(notificationsTable.sendTo, `%students%`),
        eq(notificationsTable.schoolId, schoolId),
      ),
      with: {
        files: { with: { file: true } },
        user: true,
      },
    }) as Promise<NotificationWithRelations[]>;
  }

  async deleteNotification(id: string): Promise<Notification | undefined> {
    const [row] = await this.db.delete(notificationsTable).where(eq(notificationsTable.id, id)).returning();
    return row;
  }
}

export const notificationsRepository = new NotificationsRepository(db);
