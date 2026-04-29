import * as XLSX from "xlsx";
import { db } from "../../db/db";
import { teacherExcelColumns, studentExcelColumns } from "./types"
import { users, account, teachersTable, studentsTable } from "../../db/schemas"
import { handlePassword } from "../../utils/hash_password"

type isMatchesResult = {
    isMatches: boolean;
    data?: string[][];
}

type TeacherStatus = "Active" | "Inactive" | "Pending" | "New";

const INSERT_CHUNK_SIZE = 100;


class AdminService {

    private fixStatus(rawStatus?: string): TeacherStatus {
        if (
            rawStatus === "Active" ||
            rawStatus === "Inactive" ||
            rawStatus === "Pending" ||
            rawStatus === "New"
        ) {
            return rawStatus;
        }

        return "New";
    }

    private async getEmailsFromData(data: string[][], emailColumnIndex: number): Promise<{ emails: string[], rowIndicesToSkip: Set<number> }> {
        const emails: string[] = [];
        for (let i = 1; i < data.length; i++) {
            const email = data[i][emailColumnIndex]?.trim();
            if (email) {
                emails.push(email);
            }
        }

        const existingUsers = await db.select({ email: users.email }).from(users);
        const existingEmails = new Set(existingUsers.map(u => u.email));

        const rowIndicesToSkip = new Set<number>();
        for (let i = 1; i < data.length; i++) {
            const email = data[i][emailColumnIndex]?.trim();
            if (email && existingEmails.has(email)) {
                rowIndicesToSkip.add(i);
            }
        }

        return { emails, rowIndicesToSkip };
    }

    private getColumnIndexMapTeachers(columns: string[]) {
        return {
            email: columns.indexOf("email"),
            password: columns.indexOf("password"),
            name: columns.indexOf("name"),
            createdAt: columns.indexOf("createdAt"),
            telNumber: columns.indexOf("telNumber"),
            gender: columns.indexOf("gender"),
            address: columns.indexOf("address"),
            subjects: columns.indexOf("subject"),
            dateBirth: columns.indexOf("dateBirth"),
            joiningDate: columns.indexOf("joiningDate"),
            status: columns.indexOf("status"),
        };
    }
    private getColumnIndexMapStudents(columns: string[]) {
        return {
            email: columns.indexOf("email"),
            password: columns.indexOf("password"),
            name: columns.indexOf("name"),
            createdAt: columns.indexOf("createdAt"),
            telNumber: columns.indexOf("telNumber"),
            parentPhoneNumber: columns.indexOf("parentPhoneNumber"),
            parentName: columns.indexOf("parentName"),
            status: columns.indexOf("status"),
            gender: columns.indexOf("gender"),
            address: columns.indexOf("address"),
            dateOfBirth: columns.indexOf("dateOfBirth"),
        };
    }

    private async insertTeachersInBatches(data: string[][], columns: string[], schoolId: string, rowIndicesToSkip: Set<number>) {
        const indexMapTeachers = this.getColumnIndexMapTeachers(columns);
        const userValues: Array<typeof users.$inferInsert> = [];
        const accountValues: Array<typeof account.$inferInsert> = [];
        const teacherValues: Array<typeof teachersTable.$inferInsert> = [];

        for (let i = 1; i < data.length; i++) {
            if (rowIndicesToSkip.has(i)) continue; // Skip duplicate emails

            const row = data[i];
            const userId = "teacher_" + crypto.randomUUID();
            const createdAtValue = row[indexMapTeachers.createdAt];
            const createdAt = createdAtValue ? new Date(createdAtValue) : new Date();
            const hashPassword = await handlePassword.hash(row[indexMapTeachers.password]);

            userValues.push({
                id: userId,
                email: row[indexMapTeachers.email],
                telNumber: row[indexMapTeachers.telNumber],
                name: row[indexMapTeachers.name],
                role: "teacher",
                createdAt,
            });

            accountValues.push({
                id: "account_" + crypto.randomUUID(),
                accountId: userId,
                providerId: "credentials",
                password: hashPassword,
                createdAt,
                userId,
            });

            teacherValues.push({
                id: crypto.randomUUID(),
                userId,
                schoolId,
                gender: row[indexMapTeachers.gender],
                address: row[indexMapTeachers.address],
                subject: row[indexMapTeachers.subjects],
                dateOfBirth: row[indexMapTeachers.dateBirth],
                joiningDate: row[indexMapTeachers.joiningDate],
                status: this.fixStatus(row[indexMapTeachers.status]),
            });
        }

        if (userValues.length > 0) {
            await db.transaction(async (tx) => {
                for (let i = 0; i < userValues.length; i += INSERT_CHUNK_SIZE) {
                    const end = i + INSERT_CHUNK_SIZE;

                    await tx.insert(users).values(userValues.slice(i, end));
                    await tx.insert(account).values(accountValues.slice(i, end));
                    await tx.insert(teachersTable).values(teacherValues.slice(i, end));
                }
            });
        }

        return userValues.length;
    }
    async insertStudentsInBatches(data: string[][], columns: string[], schoolId: string, rowIndicesToSkip: Set<number>) {
        const indexMapStudents = this.getColumnIndexMapStudents(columns);
        const userValues: Array<typeof users.$inferInsert> = [];
        const accountValues: Array<typeof account.$inferInsert> = [];
        const studentValues: Array<typeof studentsTable.$inferInsert> = [];

        for (let i = 1; i < data.length; i++) {
            if (rowIndicesToSkip.has(i)) continue; // Skip duplicate emails

            const row = data[i];
            const userId = "student_" + crypto.randomUUID();
            const createdAtValue = row[indexMapStudents.createdAt];
            const createdAt = createdAtValue ? new Date(createdAtValue) : new Date();
            const hashPassword = await handlePassword.hash(row[indexMapStudents.password]);

            userValues.push({
                id: userId,
                email: row[indexMapStudents.email],
                telNumber: row[indexMapStudents.telNumber],
                name: row[indexMapStudents.name],
                role: "student",
                createdAt,
            });

            accountValues.push({
                id: "account_" + crypto.randomUUID(),
                accountId: userId,
                providerId: "credentials",
                password: hashPassword,
                createdAt,
                userId,
            });

            studentValues.push({
                id: crypto.randomUUID(),
                userId,
                schoolId,
                parentPhoneNumber: row[indexMapStudents.parentPhoneNumber],
                parentName: row[indexMapStudents.parentName],
                status: this.fixStatus(row[indexMapStudents.status]),
                gender: row[indexMapStudents.gender],
                address: row[indexMapStudents.address],
                dateOfBirth: row[indexMapStudents.dateOfBirth],
            });
        }

        if (userValues.length > 0) {
            await db.transaction(async (tx) => {
                for (let i = 0; i < userValues.length; i += INSERT_CHUNK_SIZE) {
                    const end = i + INSERT_CHUNK_SIZE;

                    await tx.insert(users).values(userValues.slice(i, end));
                    await tx.insert(account).values(accountValues.slice(i, end));
                    await tx.insert(studentsTable).values(studentValues.slice(i, end));
                }
            });
        }

        return userValues.length;
    }


    async isExcelMatches(file: File): Promise<isMatchesResult> {

        const woorkbook = XLSX.read(await file.arrayBuffer(), { type: "buffer" });
        const sheetName = woorkbook.SheetNames[0];
        const sheet = woorkbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];


        return {
            isMatches: teacherExcelColumns.every(column => data[0].includes(column)) ||
                studentExcelColumns.every(column => data[0].includes(column)),
            data: data
        };
    }
    async insertInDb(type: string, data: string[][], schoolId: string): Promise<{ success: boolean, message?: string }> {
        const columns = data[0];
        const emailColumnIndex = columns.indexOf("email");

        if (emailColumnIndex === -1) {
            return { success: false, message: "Email column not found in the Excel file." };
        }

        try {
            const { emails, rowIndicesToSkip } = await this.getEmailsFromData(data, emailColumnIndex);
            const totalRows = data.length - 1; // Exclude header
            const duplicateCount = rowIndicesToSkip.size;
            const newCount = totalRows - duplicateCount;

            if (type === "teacher" || type === "teachers") {
                await this.insertTeachersInBatches(data, columns, schoolId, rowIndicesToSkip);
            } else {
                await this.insertStudentsInBatches(data, columns, schoolId, rowIndicesToSkip);
            }

            let message = "";
            if (duplicateCount > 0) {
                message = `${newCount} ${type === "teacher" || type === "teachers" ? "teachers" : "students"} added successfully. ${duplicateCount} duplicate ${duplicateCount === 1 ? "email was" : "emails were"} skipped.`;
            } else {
                message = `${newCount} ${type === "teacher" || type === "teachers" ? "teachers" : "students"} added successfully.`;
            }

            return { success: true, message };
        } catch (err) {
            console.log("Error inserting data into the database:", err);
            return { success: false, message: "An error occurred while inserting data into the database." };
        }
    }
}


export const adminService = new AdminService();