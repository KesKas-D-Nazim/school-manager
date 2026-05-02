import type { InferSelectModel } from "drizzle-orm";

import {
	assignmentsTable,
	courseFilesTable,
	coursesTable,
	filesTable,
	referencesTable,
	teachersTable,
	users,
} from "../../db/schemas.js";

export type CourseWithRelations = InferSelectModel<typeof coursesTable> & {
	teacher:
		| (InferSelectModel<typeof teachersTable> & {
				user: InferSelectModel<typeof users> | null;
		  })
		| null;
	files: (InferSelectModel<typeof courseFilesTable> & {
		file: InferSelectModel<typeof filesTable>;
	})[];
	assignments: InferSelectModel<typeof assignmentsTable>[];
	references: InferSelectModel<typeof referencesTable>[];
};
