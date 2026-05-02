import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { coursesController } from "./courses.controller.js";
import {
	CourseSearchSchema,
	createCourseSchema,
	updateCourseSchema,
} from "./courses.schema.js";

export const coursesRouter = new Hono()
	.get("/", zValidator("query", CourseSearchSchema), coursesController.listCourses)
	.get("/name/:name", coursesController.getCourseByName)
	.get("/:id", coursesController.getCourse)
	.post("/", zValidator("json", createCourseSchema), coursesController.createCourse)
	.put("/:id", zValidator("json", updateCourseSchema), coursesController.updateCourse)
	.delete("/:id", coursesController.deleteCourse);
