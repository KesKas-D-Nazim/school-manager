import { ITeachersRepository, teachersRepository } from "../../db/repo/index.ts";
import { TeacherSearchSchema } from "../../types.ts";


class AdminController {
    constructor(private readonly teachersRepository: ITeachersRepository) { }

    async listTeachers(search_queries: TeacherSearchSchema) {
        return await this.teachersRepository.listTeachers(search_queries);
    }
}

export const adminController = new AdminController(teachersRepository);