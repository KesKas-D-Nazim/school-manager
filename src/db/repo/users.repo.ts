import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { usersTable } from "../schema.js";
import type { NewUser, User } from "../../types.js";

export async function createUser(data: NewUser): Promise<User> {
  const [row] = await db.insert(usersTable).values(data).returning();
  return row;
}

export async function findUserById(id: string): Promise<User | undefined> {
  return db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
  });
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });
}

export async function findUserByUsername(
  username: string,
): Promise<User | undefined> {
  return db.query.usersTable.findFirst({
    where: eq(usersTable.username, username),
  });
}

export async function updateUser(
  id: string,
  data: Partial<NewUser>,
): Promise<User | undefined> {
  const [row] = await db
    .update(usersTable)
    .set(data)
    .where(eq(usersTable.id, id))
    .returning();
  return row;
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
