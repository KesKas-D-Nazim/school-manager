// import { and, eq, gte, lte } from "drizzle-orm";
// import type { SQL } from "drizzle-orm";

// import { db } from "../db.js";
// import { eventsTable } from "../schemas.js";
// import type { Event, NewEvent } from "../../types.js";

// export async function createEvent(data: NewEvent): Promise<Event> {
//   const [row] = await db.insert(eventsTable).values(data).returning();
//   return row;
// }


// export async function findEventById(id: string): Promise<Event | undefined> {
//   return db.query.eventsTable.findFirst({
//     where: eq(eventsTable.id, id),
//   });
// }

// export async function listEvents(filters: {
//   startDate?: string;
//   endDate?: string;
//   className?: string;
//   courseId?: string;
// } = {}): Promise<Event[]> {
//   const conditions: SQL[] = [];

//   if (filters.startDate) {
//     conditions.push(gte(eventsTable.date, new Date(filters.startDate)));
//   }

//   if (filters.endDate) {
//     conditions.push(lte(eventsTable.date, new Date(filters.endDate)));
//   }

//   if (filters.className) {
//     conditions.push(eq(eventsTable.className, filters.className));
//   }

//   if (filters.courseId !== undefined) {
//     conditions.push(eq(eventsTable.courseId, filters.courseId));
//   }

//   if (conditions.length === 0) {
//     return db.query.eventsTable.findMany();
//   }

//   return db.query.eventsTable.findMany({
//     where: and(...conditions),
//   });
// }

// export async function updateEvent(
//   id: string,
//   data: Partial<NewEvent>,
// ): Promise<Event | undefined> {
//   const [row] = await db
//     .update(eventsTable)
//     .set(data)
//     .where(eq(eventsTable.id, id))
//     .returning();
//   return row;
// }

// export async function deleteEvent(id: string): Promise<void> {
//   await db.delete(eventsTable).where(eq(eventsTable.id, id));
// }
