import { Hono } from "hono";
import * as controller from "./student.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const studentRouter = new Hono();

studentRouter.use("/*", authMiddleware);
studentRouter.get("/courses", controller.getCourses);

export default studentRouter;