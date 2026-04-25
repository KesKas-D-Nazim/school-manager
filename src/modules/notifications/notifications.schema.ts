import z from "zod";

export const createNotificationSchema = z.object({
  subject: z.string().min(1).max(160),
  type: z.string().min(1),
  content: z.string().min(1),
  sendTo: z.array(z.string()).min(1), // array not string!
  attachments: z.any().optional(), 
});

export type CreateNotificationBody = z.infer<typeof createNotificationSchema>;
