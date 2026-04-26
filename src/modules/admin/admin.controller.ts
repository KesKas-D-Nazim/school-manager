import { Context } from "hono";
import { ITeachersRepository, teachersRepository } from "../../db/repo/index.ts";
import { addMultipleSchemaBody } from "./admin.schemas.ts";
import { TeacherSearchSchema } from "../../types.ts";
import { adminService } from "./admin.service.ts";
import { json } from "zod";



class AdminController {
    constructor(private readonly teachersRepository: ITeachersRepository) { }

    async listTeachers(search_queries: TeacherSearchSchema) {
        return await this.teachersRepository.listTeachers(search_queries);
    }

    async addMultipleTeachers(c : Context) {
        
        const { file , type , schoolId } = await c.req.formData().then(form => {
            const file = form.get("file") as File;
            const type = form.get("type") as string;
            const schoolId = form.get("schoolId") as string;
            return { file, type, schoolId };
        })
        
        const validation = addMultipleSchemaBody.safeParse({ file, type, schoolId });
        if (!validation.success) {
            return c.json({success : false , message: "Invalid input data" }, 400);
        }


        const {isMatches , data} = await adminService.isExcelMatches(file);
        if (!isMatches ) {
            return c.json({ success: false, message: "Excel file does not match the required format." }, 400);
        }
        if (data === undefined || data?.length === 0) {
            return c.json({ success: false, message: "No data found in the Excel file." }, 400);
        }

        const result = await adminService.insertInDb(type, data, schoolId);

        if (!result.success) {
            return c.json({ success: false, message: result.message ?? `Failed to add ${type === "teacher" ? "teachers" : "students"}.` }, 500);
        }

        return c.json({ success: true, message: result.message }, 200);

    }
}

export const adminController = new AdminController(teachersRepository);

