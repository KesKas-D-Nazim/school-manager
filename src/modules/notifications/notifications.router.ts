import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { notificationsController } from "./notifications.controller.js";
import { createNotificationSchema } from "./notifications.schema.js";

export const notificationsRouter = new Hono()
  .get("/", notificationsController.listNotifications)
  .get("/:id", notificationsController.getNotification)
  .post(
    "/",
    zValidator("json", createNotificationSchema),
    notificationsController.createNotification,
  )
  .patch("/:id", notificationsController.markAsRead) 
  .delete("/:id", notificationsController.deleteNotification);
