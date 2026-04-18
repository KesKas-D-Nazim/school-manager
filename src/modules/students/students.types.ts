import { Student, User } from "../../types"

export type StudentWithUser = Student & {
    user: User | null
}