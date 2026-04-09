import { listTeachers } from "../../db/repo/index.ts";
import { listStudents } from "../../db/repo/students.repo.ts";

// export const AdminController = async () => {

// }

class AdminController {
    async listStudents(search?: string, page = 1, size = 10) {
        return await listStudents(search, page, size);
    }
    async listTeachers(search?: string, page = 1, size = 10) {
        return await listTeachers(search, page, size);
    }
}

export const adminController = new AdminController();