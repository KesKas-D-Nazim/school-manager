import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { studentsController } from "./students.controller.js";
import {
	createStudentSchema,
	StudentSearchSchema,
	updateStudentSchema,
} from "./students.schema.js";

export default new Hono()
	.get("/", zValidator("query", StudentSearchSchema), studentsController.listStudents)
	.get("/:id", studentsController.getStudent)
	.post("/", zValidator("json", createStudentSchema), studentsController.createStudent)
	.put("/:id", zValidator("json", updateStudentSchema), studentsController.updateStudent)
	.delete("/:id", studentsController.deleteStudent);
