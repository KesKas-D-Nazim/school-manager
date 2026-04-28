import { Hono } from "hono"
import { adminController } from "./admin.controller.ts"
// import { studentSearchSchema, teacherSearchSchema } from "../../types.ts"
import { zValidator } from "@hono/zod-validator"
// import { studentsController } from "../students/students.controller.ts"
import { paginatedSuccessResponse, successResponse } from "../../utils/response.type.ts"
import { zvalidateWithThrow } from "../../utils/middlewares/zvalidate_with_throw.middleware.ts"
import z from "zod"
import { studentsController } from "../students/students.controller.ts"

// export const adminRouter = new Hono()
//     .get(
//         "/students",
//         zValidator("query", studentSearchSchema),
//         async (c) => {
//             const data = await studentsController.listStudents(c);
//             return c.json(data)
//         })
//     .get(
//         "/students/:studentId",
//         // zvalidateWithThrow("param", validUUIDSchema),
//         async (c) => {
//             const data = await studentsController.getStudent(c);
//             return c.json(data)
//         })
//     .post(
//         "/students",
//         // zValidator("json", newStudentSchema),
//         async (c) => {
//             const data = await studentsController.createStudent(c);
//             return c.json(successResponse(data), 200);
//         })

export const adminRouter = new Hono()
.post("/add-multiple",adminController.addMultipleTeachers)





//     .get("/students", zValidator("query", studentSearchSchema), async (c) => {
//         const search_queries = c.req.valid("query");
//         const { data, pagination } = await studentsController.listStudents(search_queries);
//         return c.json({ data, pagination }, 200);
//     })
// .post("/students", (c) => {

// })
