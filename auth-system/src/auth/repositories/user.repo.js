import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export const createUser = async (data) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

export const findUserByUsername = async (username) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  return user;
};

export const findUserById = async (id) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
};