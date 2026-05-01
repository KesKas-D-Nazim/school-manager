import { Hono } from "hono"
import { adminController } from "./admin.controller.ts"
// import { studentSearchSchema, teacherSearchSchema } from "../../types.ts"
import { zValidator } from "@hono/zod-validator"
// import { studentsController } from "../students/students.controller.ts"
import { paginatedSuccessResponse, successResponse } from "../../utils/response.type.ts"
import { zvalidateWithThrow } from "../../utils/middlewares/zvalidate_with_throw.middleware.ts"
import z from "zod"
import { studentsController } from "../students/students.controller.ts"
import { StudentWithUser } from "../students/students.types.ts"

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

const studentsWithUserData: StudentWithUser[] = [
    {
        id: "student_001",
        userId: "user_001",
        schoolId: "school_001",
        status: "Active",
        parentPhoneNumber: "0550123456",
        parentName: "John Doe",
        gender: "Male",
        address: "123 Main Street",
        dateOfBirth: "2008-05-12",
        studentPictureFileId: null,
        user: {
            id: "user_001",
            name: "Ayoub Khatir",
            email: "ayoub1@example.com",
            emailVerified: false,
            image: null,
            telNumber: "0661111111",
            role: "student",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    },

    {
        id: "student_002",
        userId: "user_002",
        schoolId: "school_001",
        status: "Active",
        parentPhoneNumber: "0550234567",
        parentName: "Sarah Benali",
        gender: "Female",
        address: "Rue Didouche Mourad",
        dateOfBirth: "2009-03-21",
        studentPictureFileId: null,
        user: {
            id: "user_002",
            name: "Lina Benali",
            email: "lina2@example.com",
            emailVerified: true,
            image: null,
            telNumber: "0662222222",
            role: "student",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    },

    {
        id: "student_003",
        userId: "user_003",
        schoolId: "school_001",
        status: "Pending",
        parentPhoneNumber: "0550345678",
        parentName: "Omar Haddad",
        gender: "Male",
        address: "Bir El Djir",
        dateOfBirth: "2007-11-10",
        studentPictureFileId: null,
        user: {
            id: "user_003",
            name: "Yacine Haddad",
            email: "yacine3@example.com",
            emailVerified: false,
            image: null,
            telNumber: "0663333333",
            role: "student",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    },

    {
        id: "student_004",
        userId: "user_004",
        schoolId: "school_001",
        status: "Inactive",
        parentPhoneNumber: "0550456789",
        parentName: "Fatima Zohra",
        gender: "Female",
        address: "Hai El Yasmine",
        dateOfBirth: "2010-07-18",
        studentPictureFileId: null,
        user: {
            id: "user_004",
            name: "Imane Zohra",
            email: "imane4@example.com",
            emailVerified: true,
            image: null,
            telNumber: "0664444444",
            role: "student",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    },

    {
        id: "student_005",
        userId: "user_005",
        schoolId: "school_001",
        status: "New",
        parentPhoneNumber: "0550567890",
        parentName: "Karim Bouzid",
        gender: "Male",
        address: "El Kerma",
        dateOfBirth: "2011-01-05",
        studentPictureFileId: null,
        user: {
            id: "user_005",
            name: "Rayan Bouzid",
            email: "rayan5@example.com",
            emailVerified: false,
            image: null,
            telNumber: "0665555555",
            role: "student",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    },
];

export const adminRouter = new Hono()
    .post("/add-multiple", adminController.addMultipleTeachers)
    .get("/students", async (c) => {
        // const data = await studentsController.listStudents(c);
        console.log(studentsWithUserData);
        try {
            return c.json(studentsWithUserData, 200);
        } catch (err) {
            console.log(err);
        }
    })
    .get("/teachers/total-teachers", adminController.TotalTeachers)
// .get("/total-students", adminController.TotalStudents)






//     .get("/students", zValidator("query", studentSearchSchema), async (c) => {
//         const search_queries = c.req.valid("query");
//         const { data, pagination } = await studentsController.listStudents(search_queries);
//         return c.json({ data, pagination }, 200);
//     })
// .post("/students", (c) => {

// })
