
import { z } from "zod"

// * add multiple teachers or student  to the system using a csv file
export const addMultipleSchemaBody = z.object({
    file: z.instanceof(File),
    type: z.enum(["teachers", "students"]),
    schoolId: z.string()
})