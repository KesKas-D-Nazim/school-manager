import { Hono } from "hono";
import * as studentController from './student/student.controller.ts';
import { authMiddleware } from "../middleware/authMiddleware";
import * as teacherController from "./teacherInterface/teacher.controller.ts";
import * as adminController from "./admin/admin.controller.ts"
import { teachersController } from "./teachers/teachers.controller.ts"
import { studentsController } from "./students/students.controller.ts"

const sharedRouter = new Hono();

sharedRouter.use("/*", authMiddleware);

sharedRouter.get("/collections", (c: any) => {
    const user = c.get("user");

    if (user.role === "student") return studentController.getCourses(c);
    if (user.role === "teacher") return teacherController.getCourses(c);//c.json({ message: "teacher's courses" });
    if (user.role === "admin") return c.json({ message: "admin's courses" });

    return c.json({ message: "Forbidden"}, 403);
});

sharedRouter.get("/teachers", (c: any) => {
  const user = c.get("user");
  if (user.role === "admin") return teachersController.listTeachers(c);
  return c.json({ message: "Forbidden" }, 403);
});

sharedRouter.get("/students", (c: any) => {
    const user = c.get("user");
      if (user.role === "admin") return studentsController.listStudents(c);
  return c.json({ message: "Forbidden" }, 403);
})

sharedRouter.get("/events", (c: any) => {
    const user = c.get("user");

    if (user.role === "student") return studentController.getEvents(c);
    if (user.role === "teacher") return teacherController.getEvents(c);
    if (user.role === "admin") return adminController.getEvents(c);
})

sharedRouter.post("/events", (c: any) => {
  const user = c.get("user");
  if (user.role === "admin") return adminController.postEvent(c);
  return c.json({ message: "Forbidden" }, 403);
});

sharedRouter.delete("/events/:id", (c: any) => {
  const user = c.get("user");
  if (user.role === "admin") return adminController.deleteEvent(c);
  return c.json({ message: "Forbidden" }, 403);
});

sharedRouter.patch("/events/:id", (c: any) => {
  const user = c.get("user");
  if (user.role === "admin") return adminController.editEvent(c);
  return c.json({ message: "Forbidden" }, 403);
});

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