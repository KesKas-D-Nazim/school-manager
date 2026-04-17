import { Student, User } from "../../types";

export type StudentUser = {
    id: string;
    userId: string;
    schoolId: string;
    grade: string;
    classe: string;
    parentPhoneNumber: string;
    parentName: string;
    status: "Active" | "Inactive" | "Pending" | "New";
    gender: "Male" | "Female";
    address: string;
    dateOfBirth: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    name: string;
    telNumber: string | null;
    role: "Student" | "Teacher" | "Admin";
    createdAt: Date;
    updatedAt: Date;
}

export function StudentUserDto(student: Student, user: User): StudentUser {
    return {
        id: student.id,
        address: student.address,
        classe: student.classe,
        createdAt: user.createdAt,
        dateOfBirth: student.dateOfBirth,
        email: user.email,
        emailVerified: user.emailVerified,
        gender: student.gender,
        grade: student.grade,
        image: user.image,
        name: user.username,
        parentName: student.parentName,
        parentPhoneNumber: student.parentPhoneNumber,
        role: user.role,
        schoolId: student.schoolId,
        status: student.status,
        updatedAt: user.updatedAt,
        userId: user.id,
        telNumber: user.telNumber,
    }
}