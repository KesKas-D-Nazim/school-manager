import type { InferSelectModel } from "drizzle-orm";

import {
	assignmentFilesTable,
	assignmentsTable,
	coursesTable,
	filesTable,
} from "../../db/schemas.js";

export type AssignmentWithRelations = InferSelectModel<typeof assignmentsTable> & {
	files: (InferSelectModel<typeof assignmentFilesTable> & {
		file: InferSelectModel<typeof filesTable> | null;
	})[];
	course: InferSelectModel<typeof coursesTable> | null;
};
