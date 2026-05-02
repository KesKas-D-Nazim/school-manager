import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { assignmentsController } from "./assignments.controller.js";
import {
	createAssignmentSchema,
	updateAssignmentSchema,
} from "./assignments.schema.js";

export const assignmentsRouter = new Hono()
	.get("/", assignmentsController.listAssignments)
	.get("/:id", assignmentsController.getAssignment)
	.post(
		"/",
		zValidator("json", createAssignmentSchema),
		assignmentsController.createAssignment,
	)
	.put(
		"/:id",
		zValidator("json", updateAssignmentSchema),
		assignmentsController.updateAssignment,
	)
	.delete("/:id", assignmentsController.deleteAssignment);
