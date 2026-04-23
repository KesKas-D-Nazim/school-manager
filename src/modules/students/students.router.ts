import { Hono } from "hono";
import * as controller from "./students.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const studentsRouter = new Hono();

//studentsRouter.use("/*", authMiddleware);
studentsRouter.get("/courses", controller.getCourses);

export default studentsRouter;