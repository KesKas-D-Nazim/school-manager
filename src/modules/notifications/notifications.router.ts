import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { notificationsController } from "./notifications.controller";
import { createNotificationSchema } from "./notifications.schema";

export const notificationsRouter = new Hono()
  .get("/", notificationsController.listNotifications)
  .post(
    "/",
    zValidator("json", createNotificationSchema),
    notificationsController.createNotification,
  )
  .delete("/:id", notificationsController.deleteNotification);
