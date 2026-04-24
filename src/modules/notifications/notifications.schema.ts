import z from "zod";

export const createNotificationSchema = z.object({
  title: z.string().min(1).max(160),
  body: z.string().min(1),
  sendTo: z.string().min(1),
});

export type CreateNotificationBody = z.infer<typeof createNotificationSchema>;
