import z from "zod"
import { NewStudent } from "../../types"

export const studentSchema = z.object({
    id: z.string().optional(),
    schoolId: z.string().optional(),
    userId: z.string().optional(),
    grade: z.string().optional(),
    classe: z.string().optional(),
    parentPhoneNumber: z.string().optional(),
    parentName: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
    studentPictureFileId: z.string().optional(),
    status: z.enum(["Active", "Inactive", "Pending", "New"]).optional(),
})

export const newStudentSchema = z.object({
    schoolId: z.string().nonempty(),
    name: z.string()
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(20, { message: 'Name must be at most 20 characters' }),
    email: z
        .email({ message: 'Invalid email address' })
        .nonempty({ message: 'Email is required' }),
    grade: z.string().nonempty({ message: 'Grade is required' }),
    classe: z.string().nonempty({ message: 'Classe is required' }),
    parentPhoneNumber: z.string()
        .min(8, { message: 'Parent phone number is too short' })
        .max(15, { message: 'Parent phone number is too long' }),
    parentName: z.string().nonempty({ message: 'Parent name is required' }),
    gender: z.enum(['Male', 'Female']),
    address: z.string().nonempty(),
    dateOfBirth: z.string().nonempty(),
    imgSrc: z.string().optional(),
    telNumber: z.string()
        .min(8, { message: 'Telephone number is too short' })
        .max(15, { message: 'Telephone number is too long' }),

})

export type NewStudentSchema = z.infer<typeof newStudentSchema>

// FRONTEND

export const newStudentSchemaa = z.object({
    schoolId: z.string().optional(),
    name: z.string()
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(20, { message: 'Name must be at most 20 characters' }),
    email: z
        .email({ message: 'Invalid email address' })
        .nonempty({ message: 'Email is required' }),
    grade: z.string()
        .nonempty({ message: 'Grade is required' }),
    classe: z.string()
        .nonempty({ message: 'Grade is required' }),
    parentPhoneNumber: z.string()
        .min(8, { message: 'Parent phone number is too short' })
        .max(15, { message: 'Parent phone number is too long' }),
    parentName: z.string()
        .nonempty({ message: 'Parent name is required' }),
    status: z.enum(["Active", "Inactive", "Pending", "New"]).default("New"),
    imgSrc: z.string().optional(),
    gender: z.enum(['Male', 'Female']),
    address: z.string(),
    dateOfBirth: z.string().nonempty(),
    enrollmentDate: z.string().nonempty(),
})

export const StudentSchema = z.object({
    id: z.string(),
    name: z.string()
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(20, { message: 'Name must be at most 20 characters' }),
    email: z.string()
        .email({ message: 'Invalid email address' })
        .nonempty({ message: 'Email is required' }),
    grade: z.string()
        .nonempty({ message: 'Grade is required' }),
    classe: z.string()
        .nonempty({ message: 'Grade is required' }),
    parentPhoneNumber: z.string()
        .min(8, { message: 'Parent phone number is too short' })
        .max(15, { message: 'Parent phone number is too long' }),
    parentName: z.string()
        .nonempty({ message: 'Parent name is required' }),
    status: z.string()
        .nonempty({ message: 'Status is required' }),
    imgSrc: z.string()
        .optional(),
    gender: z.enum(['male', 'female']),
    address: z.string(),
    dateOfBirth: z.string().nonempty(),
    enrollmentDate: z.string().nonempty(),
})

export const AddStudentSchema = StudentSchema.omit({ id: true, status: true })
export const EditStudentSchema = StudentSchema.omit({ id: true })
