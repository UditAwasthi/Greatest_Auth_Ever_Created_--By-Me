import { db } from "../../db/index.js";
import { sessions } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export const createSession = async (data) => {
  const [session] = await db.insert(sessions).values(data).returning();
  return session;
};

export const findSession = async (token) => {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.refreshToken, token));

  return session;
};

export const deleteSession = async (token) => {
  return db.delete(sessions).where(eq(sessions.refreshToken, token));
};

export const deleteAllSessionsByUserId = async (userId) =>{
  return db.delete(sessions).where(eq(sessions.userId,userId));
};