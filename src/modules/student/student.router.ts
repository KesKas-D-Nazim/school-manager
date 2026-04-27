import { Hono } from "hono";
import * as controller from "./student.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const studentRouter = new Hono();

studentRouter.use("/*", authMiddleware);
studentRouter.get("/courses", controller.getCourses);

export default studentRouter;