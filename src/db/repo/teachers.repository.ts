import { and, eq, inArray, like, sql } from "drizzle-orm";

import { Database, db } from "../db.js";
import type { NewTeacher, Teacher, TeacherSearchSchema } from "../../types.js";
import { TeacherWithUser } from "../../modules/teachers/teachers.types.js";
import { teachersTable, users } from "../schemas.js";

export interface ITeachersRepository {
  createTeacher(data: NewTeacher): Promise<Teacher[]>;
  findTeacherById(id: string): Promise<Teacher | undefined>;
  findTeacherByUserId(userId: string): Promise<Teacher | undefined>;
  listTeachers(search_aueries: TeacherSearchSchema & { schoolId: string }): Promise<{ data: TeacherWithUser[]; pagination: { totalCount: number, totalPages: number } }>;
  updateTeacher(id: string, data: Partial<NewTeacher>): Promise<Teacher | undefined>;
  deleteTeacher(id: string): Promise<Teacher | undefined>;
  getTotalTeachers(schoolId: string): Promise<number>;
}

class TeacherRepository implements ITeachersRepository {
  constructor(private readonly db: Database) { }

  async createTeacher(data: NewTeacher): Promise<Teacher[]> {
    const payload = { ...data, id: data.id ?? crypto.randomUUID() };
    const rows = await db.insert(teachersTable).values(payload).returning();
    return rows;
  }

  async findTeacherById(id: string) {
    return db.query.teachersTable.findFirst({
      where: eq(teachersTable.id, id),
      with: { user: true },
    });
  }

  async findTeacherByUserId(
    userId: string,
  ) {
    return db.query.teachersTable.findFirst({
      where: eq(teachersTable.userId, userId),
      with: { user: true },
    });
  }

  async listTeachers({
    schoolId,
    search,
    page,
    size,
    sortBy,
    sortOrder,
    subject
  }: TeacherSearchSchema & { schoolId: string }): Promise<{ data: TeacherWithUser[]; pagination: { totalCount: number; totalPages: number; }; }> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, size);
    const offset = (safePage - 1) * safeLimit;
    const searchValue = search?.trim();

    const whereClause = searchValue
      ? and(
        eq(teachersTable.schoolId, schoolId),
        inArray(
          teachersTable.userId,
          db
            .select({ id: users.id })
            .from(users)
            .where(like(users.name, `%${searchValue}%`)),
        ),
      )
      : eq(teachersTable.schoolId, schoolId);

    const totalQuery = db
      .select({ total: sql<number>`count(*)` })
      .from(teachersTable)
      .where(whereClause);
    const [totalRow] = await totalQuery;
    const totalCount = Number(totalRow?.total ?? 0);
    const totalPages = Math.ceil(totalCount / safeLimit);

    const data = await db.query.teachersTable.findMany({
      where: whereClause,
      with: { user: true },
      limit: safeLimit,
      offset,
    });

    return { data, pagination: { totalCount, totalPages } };
  }



  async updateTeacher(
    id: string,
    data: Partial<NewTeacher>,
  ): Promise<Teacher | undefined> {
    const [row] = await db
      .update(teachersTable)
      .set(data)
      .where(eq(teachersTable.id, id))
      .returning();
    return row;
  }

  async deleteTeacher(id: string): Promise<Teacher | undefined> {
    const [row] = await db.delete(teachersTable).where(eq(teachersTable.id, id)).returning();
    return row;
  }

  async getTotalTeachers(schoolId: string): Promise<number> {
    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(teachersTable)
      .where(eq(teachersTable.schoolId, schoolId));
    return Number(row?.count ?? 0);
  }
}

export const teachersRepository = new TeacherRepository(db);


