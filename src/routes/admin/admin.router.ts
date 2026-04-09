import { Hono } from "hono"
import { studentSearchSchema, teacherSearchSchema } from "../../types.ts"
import { zValidator } from "@hono/zod-validator"
import { adminController } from "./admin.controller.ts"


export const adminRouter = new Hono()
    .get("/students", zValidator("query", studentSearchSchema), async (c) => {
        const { search, page, size } = c.req.valid("query");
        const response = await adminController.listStudents(search, Number(page), Number(size));
        return c.json({ data: response.data, total: response.total }, 200);
    })
    .get("/teachers", zValidator("query", teacherSearchSchema), async (c) => {
        const { search, page, size } = c.req.valid("query");
        const response = await adminController.listTeachers(search, Number(page), Number(size));
        return c.json({ data: response.data, total: response.total }, 200);
    })