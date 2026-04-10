import { IStudentsRepository, studentsRepository } from "../../db/repo";
import { StudentSearchSchema } from "../../types";

class StudentsController {
    constructor(private readonly studentsRepository: IStudentsRepository) { }

    async listStudents(search_queries: StudentSearchSchema) {
        return await this.studentsRepository.listStudents(search_queries);
    }
    

}

export const studentsController = new StudentsController(studentsRepository);

