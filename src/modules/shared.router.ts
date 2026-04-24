import { Hono } from "hono";
import * as studentController from './student/student.controller.ts';
import { authMiddleware } from "../middleware/authMiddleware";
import * as teacherController from "./teacherInterface/teacher.controller.ts";

const sharedRouter = new Hono();

sharedRouter.use("/*", authMiddleware);

sharedRouter.get("/collections", (c: any) => {
    const user = c.get("user");

    if (user.role === "student") return studentController.getCourses(c);
    if (user.role === "teacher") return c.json({ message: "teacher's courses" });
    if (user.role === "admin") return c.json({ message: "admin's courses" });

    return c.json({ message: "Forbidden"}, 403);
});

sharedRouter.get("/events", (c: any) => {
    const user = c.get("user");

    if (user.role === "student") return studentController.getEvents(c);
    if (user.role === "teacher") return teacherController.getEvents(c);
})

sharedRouter.get("/notifications", (c: any) => {
    return c.json([]);
})

sharedRouter.get("/resources", (c: any) => {
    return c.json([]);
})

sharedRouter.get("/teacherNotifications", (c: any) => {
  return c.json([]);
});

export default sharedRouter;