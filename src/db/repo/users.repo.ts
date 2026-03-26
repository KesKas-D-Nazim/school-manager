import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { users } from "../schema.js";
import type { NewUser, User } from "../../types.js";

export async function createUser(data: NewUser): Promise<User> {
  const [row] = await db.insert(users).values(data).returning();
  return row;
}

export async function findUserById(id: number): Promise<User | undefined> {
  const [row] = await db.select().from(users).where(eq(users.id, id));
  return row;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const [row] = await db.select().from(users).where(eq(users.email, email));
  return row;
}

export async function findUserByUsername(
  username: string,
): Promise<User | undefined> {
  const [row] = await db.select().from(users).where(eq(users.username, username));
  return row;
}
