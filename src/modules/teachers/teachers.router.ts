import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { teachersController } from "./teachers.controller";
import {
	createTeacherSchema,
	TeacherSearchSchema,
	updateTeacherSchema,
} from "./teachers.schema";

export const teachersRouter = new Hono()
	.get("/", zValidator("query", TeacherSearchSchema), teachersController.listTeachers)
	.get("/:id", teachersController.getTeacher)
	.post("/", zValidator("json", createTeacherSchema), teachersController.createTeacher)
	.put("/:id", zValidator("json", updateTeacherSchema), teachersController.updateTeacher)
	.delete("/:id", teachersController.deleteTeacher);
