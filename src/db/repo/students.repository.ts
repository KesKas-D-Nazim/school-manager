import { db, type Database } from "../db.ts";
import { studentsTable, users } from "../schemas.ts";
import type { NewStudent, Student, StudentSearchSchema } from "../../types.ts";
import { eq, inArray, like, sql } from "drizzle-orm";
import { StudentWithUser } from "../../modules/student/students.types.ts";

export interface IStudentsRepository {
  createStudent(data: NewStudent): Promise<Student>;
  findStudentById(id: string): Promise<StudentWithUser | undefined>;
  findStudentByUserId(userId: string): Promise<StudentWithUser | undefined>;
  listStudents(search_queries: StudentSearchSchema): Promise<{ data: StudentWithUser[]; pagination: { totalCount: number, totalPages: number } }>;
  updateStudent(id: string, data: Partial<NewStudent>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<void>;
}

class StudentsRepository implements IStudentsRepository {
  constructor(private readonly db: Database) { }

  async createStudent(data: NewStudent): Promise<Student> {
    const [row] = await this.db.insert(studentsTable).values(data).returning();
    return row;
  }

  async findStudentById(id: string) {
    return db.query.studentsTable.findFirst({
      where: eq(studentsTable.id, id),
      with: { user: true },
    });
  }

  async findStudentByUserId(
    userId: string,
  ) {
    return this.db.query.studentsTable.findFirst({
      where: eq(studentsTable.userId, userId),
      with: { user: true },
    });
  }

  async listStudents({
    search,
    page,
    size,
    sortBy,
    sortOrder,
    grade,
    status
  }: StudentSearchSchema
  ) {
    const offset = (page - 1) * size;
    const searchValue = search?.trim();

    const whereClause = searchValue
      ? inArray(
        studentsTable.userId,
        this.db
          .select({ id: users.id })
          .from(users)
          .where(like(users.name, `%${searchValue}%`)),
      )
      : undefined;

    const totalQuery = whereClause
      ? this.db
        .select({ total: sql<number>`count(*)` })
        .from(studentsTable)
        .where(whereClause)
      : this.db.select({ total: sql<number>`count(*)` }).from(studentsTable);
    const [totalRow] = await totalQuery;
    const totalCount = Number(totalRow?.total ?? 0);
    const totalPages = Math.ceil(totalCount / size);

    const data = whereClause
      ? await this.db.query.studentsTable.findMany({
        where: whereClause,
        with: { user: true },
        limit: size,
        offset,
      })
      : await this.db.query.studentsTable.findMany({
        with: { user: true },
        limit: size,
        offset,
      });

    return { data, pagination: { totalCount, totalPages } };
  }

  // add both size and page

  async updateStudent(
    id: string,
    data: Partial<NewStudent>,
  ): Promise<Student | undefined> {
    const [row] = await this.db
      .update(studentsTable)
      .set(data)
      .where(eq(studentsTable.id, id))
      .returning();
    return row;
  }

  async deleteStudent(id: string): Promise<void> {
    await this.db.delete(studentsTable).where(eq(studentsTable.id, id));
  }

}

export const studentsRepository = new StudentsRepository(db);