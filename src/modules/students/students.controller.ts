import { IStudentsRepository, studentsRepository, usersRepository } from "../../db/repo";
import { NewStudent, StudentSearchSchema } from "../../types";
import generateId from "../../utils/id_generator";
import { generateTemporaryPassword } from "../../utils/temp_password_generator";
import { passwordHasher } from "../auth/services/password_hasher.service";
import { NewStudentSchema } from "./students.schema";
import { StudentUser, StudentUserDto } from "./students.types";

class StudentsController {
    constructor(private readonly studentsRepository: IStudentsRepository) { }

    async listStudents(search_queries: StudentSearchSchema) {
        return await this.studentsRepository.listStudents(search_queries);
    }

    async addStudent(data: NewStudentSchema) {
        const userId = generateId();
        const studentId = crypto.randomUUID();
        console.log(studentId)

        const password = generateTemporaryPassword(data.name)
        const passwordHash = await passwordHasher.hashPassword(password);

        const newUser = await usersRepository.createUser({
            id: userId,
            email: data.email,
            passwordHash,
            role: "Student",
            username: data.name,
            image: data.imgSrc,
            emailVerified: false,
            telNumber: data.telNumber
        });

        const student = await studentsRepository.createStudent({
            userId: userId,
            id: studentId,
            gender: data.gender,
            schoolId: data.schoolId,
            grade: data.grade,
            classe: data.classe,
            address: data.address,
            dateOfBirth: data.dateOfBirth,
            parentName: data.parentName,
            parentPhoneNumber: data.parentPhoneNumber,
            status: "New",
        })

        console.log(student)
        console.log(newUser)

        const studentWithUser: StudentUser = StudentUserDto(student, newUser);
        return studentWithUser
    }

    async getStudent(studentId: string) {
        return this.studentsRepository.findStudentById(studentId)
    }
}

export const studentsController = new StudentsController(studentsRepository);

