import { and, eq, like, sql } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

import { db, type Database } from "../db.js";
import {
  assignmentsTable,
  courseFilesTable,
  coursesTable,
  filesTable,
  referencesTable,
  teachersTable,
  users,
} from "../schemas.js";
import type { Course, NewCourse } from "../../types.js";

export type CourseWithRelations = InferSelectModel<typeof coursesTable> & {
  teacher: (InferSelectModel<typeof teachersTable> & {
    user: InferSelectModel<typeof users> | null;
  }) | null;
  files: Array<InferSelectModel<typeof courseFilesTable> & {
    file: InferSelectModel<typeof filesTable> | null;
  }>;
  assignments: InferSelectModel<typeof assignmentsTable>[];
  references: InferSelectModel<typeof referencesTable>[];
};

export interface ICoursesRepository {
  createCourse(data: NewCourse): Promise<Course[]>;
  findCourseById(id: string): Promise<CourseWithRelations | undefined>;
  findCourseByName(name: string, schoolId: string): Promise<CourseWithRelations | undefined>;
  listCourses(params: {
    schoolId: string;
    teacherId?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<{ data: CourseWithRelations[]; pagination: { totalCount: number; totalPages: number } }>;
  updateCourse(id: string, data: Partial<NewCourse>): Promise<Course | undefined>;
  deleteCourse(id: string): Promise<Course | undefined>;
}

class CoursesRepository implements ICoursesRepository {
  constructor(private readonly db: Database) {}

  async createCourse(data: NewCourse): Promise<Course[]> {
    const payload = { ...data, id: data.id ?? crypto.randomUUID() };
    const rows = await this.db.insert(coursesTable).values(payload).returning();
    return rows;
  }

  async findCourseById(id: string): Promise<CourseWithRelations | undefined> {
    return this.db.query.coursesTable.findFirst({
      where: eq(coursesTable.id, id),
      with: {
        teacher: {
          with: { user: true },
        },
        files: {
          with: { file: true },
        },
        assignments: true,
        references: true,
      },
    }) as Promise<CourseWithRelations | undefined>;
  }

  async findCourseByName(name: string, schoolId: string): Promise<CourseWithRelations | undefined> {
    return this.db.query.coursesTable.findFirst({
      where: and(eq(coursesTable.name, name), eq(coursesTable.schoolId, schoolId)),
      with: {
        teacher: {
          with: { user: true },
        },
        files: {
          with: { file: true },
        },
        assignments: true,
        references: true,
      },
    }) as Promise<CourseWithRelations | undefined>;
  }

  async listCourses({
    schoolId,
    teacherId,
    search,
    page = 1,
    size = 10,
  }: {
    schoolId: string;
    teacherId?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<{ data: CourseWithRelations[]; pagination: { totalCount: number; totalPages: number } }> {
    const safePage = Math.max(1, page);
    const safeSize = Math.max(1, size);
    const offset = (safePage - 1) * safeSize;
    const searchValue = search?.trim();

    const whereClause = and(
      eq(coursesTable.schoolId, schoolId),
      teacherId ? eq(coursesTable.teacherId, teacherId) : undefined,
      searchValue ? like(coursesTable.name, `%${searchValue}%`) : undefined,
    );

    const [totalRow] = await this.db
      .select({ total: sql<number>`count(*)` })
      .from(coursesTable)
      .where(whereClause);
    const totalCount = Number(totalRow?.total ?? 0);
    const totalPages = Math.ceil(totalCount / safeSize);

    const data = await this.db.query.coursesTable.findMany({
      where: whereClause,
      with: {
        teacher: {
          with: { user: true },
        },
      },
      limit: safeSize,
      offset,
    });

    return {
      data: data as CourseWithRelations[],
      pagination: { totalCount, totalPages },
    };
  }

  async updateCourse(id: string, data: Partial<NewCourse>): Promise<Course | undefined> {
    const [row] = await this.db
      .update(coursesTable)
      .set(data)
      .where(eq(coursesTable.id, id))
      .returning();
    return row;
  }

  async deleteCourse(id: string): Promise<Course | undefined> {
    const [row] = await this.db.delete(coursesTable).where(eq(coursesTable.id, id)).returning();
    return row;
  }
}

export const coursesRepository = new CoursesRepository(db);
