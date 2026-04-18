// import { IStudentsRepository, studentsRepository } from "../../db/repo";
// import { StudentSearchSchema } from "../../types";

// class StudentsController {
//     constructor(private readonly studentsRepository: IStudentsRepository) { }

//     async listStudents(search_queries: StudentSearchSchema) {
//         return await this.studentsRepository.listStudents(search_queries);
//     }
    

// }

// export const studentsController = new StudentsController(studentsRepository);

import { db } from "../../db/db";
import { coursesTable } from "../../db/schemas";
import { eq } from "drizzle-orm";

export const getCourses = async (c: any) => {
  try {
    // TEMP: hardcoded school (because no middleware yet)
    const schoolId = "school_1";

    const courses = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.schoolId, schoolId));

    return c.json({ courses });
  } catch (err) {
    return c.json({ error: "Failed to fetch courses" }, 500);
  }
};