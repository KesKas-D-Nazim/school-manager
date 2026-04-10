import { Hono } from "hono"
import { studentSearchSchema, teacherSearchSchema } from "../../types.ts"
import { zValidator } from "@hono/zod-validator"
import { studentsController } from "../students/students.controller.ts"


export const adminRouter = new Hono()
    .get("/students", zValidator("query", studentSearchSchema), async (c) => {
        const search_queries = c.req.valid("query");
        const { data, pagination } = await studentsController.listStudents(search_queries);
        return c.json({ data, pagination }, 200);
    })
// .post("/students", (c) => {

// })
