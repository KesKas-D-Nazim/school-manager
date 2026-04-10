import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { studentSearchSchema } from "../../types";
import { studentsController } from "./students.controller";

export const studentsRouter = new Hono()
    .get("/", zValidator("query", studentSearchSchema), async (c) => {
        const search_queries = c.req.valid("query");
        const { data, pagination } = await studentsController.listStudents(search_queries);
        return c.json({ data, pagination }, 200);
    })