import { Context } from "hono";
import { notificationsRepository } from "../../db/repo/index.ts";
import type { CreateNotificationBody } from "./notifications.schema.ts";

type AuthUser = {
  id?: string;
  role?: "admin" | "teacher" | "student";
  info?: {
    id?: string;
    schoolId?: string;
    classe?: string | null;
  };
};

class NotificationsController {
  async listNotifications(c: Context) {
    const user = c.get("user") as AuthUser | undefined;
    const schoolId =
      user?.role === "admin" ? user?.info?.id : user?.info?.schoolId;

    if (!schoolId) {
      return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    let data;

    if (user?.role === "admin") {
      data = await notificationsRepository.listAllNotifications(schoolId);
    } else if (user?.role === "teacher") {
      if (!user.id) {
        return c.json({ success: false, message: "Unauthorized" }, 401);
      }
      data = await notificationsRepository.listNotificationsByUserId(
        user.id,
        schoolId,
      );
    } else if (user?.role === "student") {
      const classe = user?.info?.classe;

      if (!classe) {
        return c.json({ success: false, message: "Student class not found" }, 400);
      }

      data = await notificationsRepository.listNotificationsForStudent(
        classe,
        schoolId,
      );
    } else {
      return c.json({ success: false, message: "Forbidden" }, 403);
    }

    return c.json({ success: true, data }, 200);
  }

  async createNotification(c: Context) {
    const user = c.get("user") as AuthUser | undefined;

    if (user?.role !== "admin" && user?.role !== "teacher") {
      return c.json({ success: false, message: "Forbidden" }, 403);
    }

    const schoolId =
      user.role === "admin" ? user.info?.id : user.info?.schoolId;

    if (!schoolId) {
      return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    if (!user.id) {
      return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    const body = (c.req as any).valid("json") as CreateNotificationBody;

    try {
      const notification = await notificationsRepository.createNotification({
        id: crypto.randomUUID(),
        schoolId,
        usersId: user.id,
        ...body,
      });

      return c.json({ success: true, data: notification }, 201);
    } catch (_error) {
      return c.json({ success: false, message: "Failed to create notification" }, 400);
    }
  }

  async deleteNotification(c: Context) {
    const user = c.get("user") as AuthUser | undefined;
    const schoolId =
      user?.role === "admin" ? user?.info?.id : user?.info?.schoolId;

    if (!schoolId) {
      return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    const id = c.req.param("id")!;
    const notification = await notificationsRepository.findNotificationById(id);

    if (!notification) {
      return c.json({ success: false, message: "Notification not found" }, 404);
    }

    if (notification.schoolId !== schoolId) {
      return c.json({ success: false, message: "Forbidden" }, 403);
    }

    const isAdmin = user?.role === "admin";
    const isOwner = notification.usersId === user?.id;

    if (!isAdmin && !isOwner) {
      return c.json({ success: false, message: "Forbidden" }, 403);
    }

    await notificationsRepository.deleteNotification(id);

    return c.json({ success: true, message: "Notification deleted" }, 200);
  }
}

export const notificationsController = new NotificationsController();
