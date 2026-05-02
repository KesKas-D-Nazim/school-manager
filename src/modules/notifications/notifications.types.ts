import type { InferSelectModel } from "drizzle-orm";
import {
  filesTable,
  notificationFilesTable,
  notificationsTable,
  users,
} from "../../db/schemas.js";

export type NotificationWithRelations = InferSelectModel<typeof notificationsTable> & {
  files: Array<InferSelectModel<typeof notificationFilesTable> & {
    file: InferSelectModel<typeof filesTable> | null;
  }>;
  user: InferSelectModel<typeof users> | null;
};
