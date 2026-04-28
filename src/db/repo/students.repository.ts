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
    const [row] = await this.db.insert(studentsTable).values({
      ...data,
      id: data.id ?? crypto.randomUUID(),
    }).returning();
    return row;
  }

  async findStudentById(id: string) {
    const student = await db.query.studentsTable.findFirst({
      where: eq(studentsTable.id, id),
      with: { user: true },
    });
    return student
    // ? undefined : StudentWithUserDto(student, student.user!)
  }

  async findStudentByUserId(
    userId: string,
  ) {
    const student = await this.db.query.studentsTable.findFirst({
      where: eq(studentsTable.userId, userId),
      with: { user: true },
    });
    return student
    // ? undefined : StudentUserDto(student, student.user!)

  }

  async listStudents({
    search,
    page,
    size,
    sortBy,
    sortOrder,
    grade,
    status,
    schoolId
  }: StudentSearchSchema
  ) {
    const offset = (page - 1) * size;
    const searchValue = search?.trim();

    // Define the where clause once
    const whereClause = searchValue
      ? inArray(
        studentsTable.userId,
        this.db
          .select({ id: users.id })
          .from(users)
          .where(like(users.name, `%${searchValue}%`)),
      )
      : undefined;

    // Run both queries in parallel to save time
    const [data] = await Promise.all([
      this.db.query.studentsTable.findMany({
        where: whereClause,
        with: { user: true },
        limit: size,
        offset,
      }),
      // this.db
      //   .select({ total: count() })
      //   .from(studentsTable)
      //   .where(whereClause),
    ]);

    const totalCount = 0// Number(totalResult[0]?.total ?? 0);
    const totalPages = 0// Math.ceil(totalCount / size);

    const data_dtos = data.map(student => student)
    return { data: data_dtos, pagination: { totalCount, totalPages } };
  }


  async updateStudent(
    id: string,
    data: Partial<NewStudent>,
  ): Promise<Student | undefined> {
    const [student] = await this.db
      .update(studentsTable)
      .set(data)
      .where(eq(studentsTable.id, id))
      .returning();
    return student;
  }

  async deleteStudent(id: string): Promise<void> {
    await this.db.delete(studentsTable).where(eq(studentsTable.id, id));
  }

}

export const studentsRepository = new StudentsRepository(db);