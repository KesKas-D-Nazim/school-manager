import { eq } from "drizzle-orm";
import { Database, db } from "../db.js";
import { users } from "../schemas.js";
import type { NewUser, User } from "../../types.js";


export interface IUsersRepository {
  createUser(data: NewUser): Promise<User[]>
  findUserById(id: string): Promise<User | undefined>
  findUserByUsername(username: string): Promise<User | undefined>
  findUserByEmail(email: string): Promise<User | undefined>
  updateUser(id: string, data: Partial<NewUser>): Promise<User | undefined>
  deleteUser(id: string): Promise<User | undefined>
}

class UsersRepository implements IUsersRepository {
  constructor(private readonly db: Database) { }

  async createUser(data: NewUser): Promise<User[]> {
    const payload = { ...data, id: data.id ?? crypto.randomUUID() };
    const rows = await this.db.insert(users).values(payload).returning();
    return rows;
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findUserByUsername(
    username: string,
  ): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: eq(users.name, username),
    });
  }

  async updateUser(
    id: string,
    data: Partial<NewUser>,
  ): Promise<User | undefined> {
    const [row] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return row;
  }

  async deleteUser(id: string): Promise<User | undefined> {
    const [row] = await this.db.delete(users).where(eq(users.id, id)).returning();
    return row;
  }
}

export const usersRepository = new UsersRepository(db);
