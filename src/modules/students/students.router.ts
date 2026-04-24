<<<<<<< HEAD
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { studentsController } from "./students.controller";
import {
	createStudentSchema,
	StudentSearchSchema,
	updateStudentSchema,
} from "./students.schema";

export default new Hono()
	.get("/", zValidator("query", StudentSearchSchema), studentsController.listStudents)
	.get("/:id", studentsController.getStudent)
	.post("/", zValidator("json", createStudentSchema), studentsController.createStudent)
	.put("/:id", zValidator("json", updateStudentSchema), studentsController.updateStudent)
	.delete("/:id", studentsController.deleteStudent);
=======
import { Hono } from "hono";
import * as controller from "./students.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const studentsRouter = new Hono();

//studentsRouter.use("/*", authMiddleware);
studentsRouter.get("/courses", controller.getCourses);

export default studentsRouter;
>>>>>>> ddf50faac520890ead948dcdfd8285bb11b1b0bb
