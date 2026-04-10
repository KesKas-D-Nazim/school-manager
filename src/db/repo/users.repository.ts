import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { users } from "../schemas.js";
import type { NewUser, User } from "../../types.js";

export async function createUser(data: NewUser): Promise<User> {
  const [row] = await db.insert(users).values(data).returning();
  return row;
}

export async function findUserById(id: string): Promise<User | undefined> {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function findUserByUsername(
  username: string,
): Promise<User | undefined> {
  return db.query.users.findFirst({
    where: eq(users.username, username),
  });
}

export async function updateUser(
  id: string,
  data: Partial<NewUser>,
): Promise<User | undefined> {
  const [row] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return row;
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id));
}
