import { Teacher, User } from "../../types";


export type TeacherWithUser = Teacher & {
    user: User | null;
}