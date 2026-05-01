import { eq, sql } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

import { db, type Database } from "../db.js";
import {
    assignmentFilesTable,
    assignmentsTable,
    coursesTable,
    filesTable,
} from "../schemas.js";
import type { Assignment, NewAssignment } from "../../types.js";

export type AssignmentWithRelations = Assignment & {
    files: Array<InferSelectModel<typeof assignmentFilesTable> & {
        file: InferSelectModel<typeof filesTable> | null;
    }>;
    course: InferSelectModel<typeof coursesTable> | null;
};

export interface IAssignmentsRepository {
    createAssignment(data: NewAssignment): Promise<Assignment>;
    findAssignmentById(id: string): Promise<AssignmentWithRelations | undefined>;
    listAssignmentsByCourseId(courseId: string): Promise<AssignmentWithRelations[]>;
    listAssignmentsBySchoolId(
        schoolId: string,
        page?: number,
        size?: number,
    ): Promise<{ data: AssignmentWithRelations[]; pagination: { totalCount: number; totalPages: number } }>;
    updateAssignment(id: string, data: Partial<NewAssignment>): Promise<Assignment | undefined>;
    deleteAssignment(id: string): Promise<void>;
}

class AssignmentsRepository implements IAssignmentsRepository {
    constructor(private readonly db: Database) {}

    async createAssignment(data: NewAssignment): Promise<Assignment> {
        const [row] = await this.db.insert(assignmentsTable).values(data).returning();
        return row;
    }

    async findAssignmentById(
        id: string,
    ): Promise<AssignmentWithRelations | undefined> {
        return this.db.query.assignmentsTable.findFirst({
            where: eq(assignmentsTable.id, id),
            with: { files: { with: { file: true } }, course: true },
        }) as Promise<AssignmentWithRelations | undefined>;
    }

    async listAssignmentsByCourseId(
        courseId: string,
    ): Promise<AssignmentWithRelations[]> {
        return this.db.query.assignmentsTable.findMany({
            where: eq(assignmentsTable.courseId, courseId),
            with: { files: { with: { file: true } }, course: true },
        }) as Promise<AssignmentWithRelations[]>;
    }

    async listAssignmentsBySchoolId(
        schoolId: string,
        page = 1,
        size = 10,
    ): Promise<{ data: AssignmentWithRelations[]; pagination: { totalCount: number; totalPages: number } }> {
        const safePage = Math.max(1, page);
        const safeSize = Math.max(1, size);
        const offset = (safePage - 1) * safeSize;

        const [totalRow] = await this.db
            .select({ total: sql<number>`count(*)` })
            .from(assignmentsTable)
            .where(eq(assignmentsTable.schoolId, schoolId));
        const totalCount = Number(totalRow?.total ?? 0);
        const totalPages = Math.ceil(totalCount / safeSize);

        const data = await this.db.query.assignmentsTable.findMany({
            where: eq(assignmentsTable.schoolId, schoolId),
            with: { files: { with: { file: true } }, course: true },
            limit: safeSize,
            offset,
        });

        return {
            data: data as AssignmentWithRelations[],
            pagination: { totalCount, totalPages },
        };
    }

    async updateAssignment(
        id: string,
        data: Partial<NewAssignment>,
    ): Promise<Assignment | undefined> {
        const [row] = await this.db
            .update(assignmentsTable)
            .set(data)
            .where(eq(assignmentsTable.id, id))
            .returning();
        return row;
    }

    async deleteAssignment(id: string): Promise<void> {
        await this.db.delete(assignmentsTable).where(eq(assignmentsTable.id, id));
    }
}

export const assignmentsRepository = new AssignmentsRepository(db);
