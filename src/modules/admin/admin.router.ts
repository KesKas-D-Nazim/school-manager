import { Hono } from "hono"
import { studentSearchSchema, teacherSearchSchema, validUUIDSchema } from "../../types.ts"
import { zValidator } from "@hono/zod-validator"
import { studentsController } from "../students/students.controller.ts"
import { newStudentSchema } from "../students/students.schema.ts"
import { paginatedSuccessResponse, successResponse } from "../../utils/response.type.ts"
import { zvalidateWithThrow } from "../../utils/middlewares/zvalidate_with_throw.middleware.ts"
import z from "zod"

export const adminRouter = new Hono()
    .get(
        "/students",
        zValidator("query", studentSearchSchema),
        async (c) => {
            const search_queries = c.req.valid("query");
            const { data, pagination } = await studentsController.listStudents(search_queries);
            return c.json(paginatedSuccessResponse(data, pagination), 200);
        })
    .get(
        "/students/:studentId",
        zvalidateWithThrow("param", validUUIDSchema),
        async (c) => {
            const studentId = c.req.valid("param");
            console.log(studentId);
            const data = await studentsController.getStudent(studentId);
            return c.json(successResponse(data), 200);
        })
    .post(
        "/students",
        zValidator("json", newStudentSchema),
        async (c) => {
            const body = c.req.valid("json");
            console.log(body)
            const data = await studentsController.addStudent(body);
            return c.json(successResponse(data), 200);
        })

