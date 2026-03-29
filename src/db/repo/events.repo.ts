import { and, eq, gte, lte } from "drizzle-orm";
import type { SQL } from "drizzle-orm";

import { db } from "../db.js";
import { events } from "../schema.js";
import type { Event, NewEvent } from "../../types.js";

export async function createEvent(data: NewEvent): Promise<Event> {
  const [row] = await db.insert(events).values(data).returning();
  return row;
}

export async function findEventById(id: number): Promise<Event | undefined> {
  return db.query.events.findFirst({
    where: eq(events.id, id),
  });
}

export async function listEvents(filters: {
  startDate?: string;
  endDate?: string;
  className?: string;
  courseId?: number;
} = {}): Promise<Event[]> {
  const conditions: SQL[] = [];

  if (filters.startDate) {
    conditions.push(gte(events.date, filters.startDate));
  }

  if (filters.endDate) {
    conditions.push(lte(events.date, filters.endDate));
  }

  if (filters.className) {
    conditions.push(eq(events.className, filters.className));
  }

  if (filters.courseId !== undefined) {
    conditions.push(eq(events.courseId, filters.courseId));
  }

  if (conditions.length === 0) {
    return db.query.events.findMany();
  }

  return db.query.events.findMany({
    where: and(...conditions),
  });
}

export async function updateEvent(
  id: number,
  data: Partial<NewEvent>,
): Promise<Event | undefined> {
  const [row] = await db
    .update(events)
    .set(data)
    .where(eq(events.id, id))
    .returning();
  return row;
}

export async function deleteEvent(id: number): Promise<void> {
  await db.delete(events).where(eq(events.id, id));
}
