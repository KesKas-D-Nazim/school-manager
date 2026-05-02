import { Student, User } from "../../types.js"

export type StudentWithUser = Student & {
    user: User | null
}