import { ITeachersRepository, teachersRepository } from "../../db/repo/index.ts";
import { TeacherSearchSchema } from "../../types.ts";


class AdminController {
    constructor(private readonly teachersRepository: ITeachersRepository) { }

    async listTeachers(search_queries: TeacherSearchSchema, schoolId: string) {
        return await this.teachersRepository.listTeachers({
            ...search_queries,
            schoolId,
        });
    }
}

export const adminController = new AdminController(teachersRepository);