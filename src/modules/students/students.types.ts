import type { InferSelectModel } from "drizzle-orm";
import { studentsTable, users } from "../../db/schemas.js";

export type StudentWithUser = InferSelectModel<typeof studentsTable> & {
	user: InferSelectModel<typeof users> | null;
};
