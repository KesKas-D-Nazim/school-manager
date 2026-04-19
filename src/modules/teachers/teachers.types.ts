import { InferSelectModel } from "drizzle-orm";
import { teachersTable, users } from "../../db/schemas";

export type TeacherWithUser = InferSelectModel<typeof teachersTable> & {
	user: InferSelectModel<typeof users> | null;
};
