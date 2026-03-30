import { db } from "../../db/index.js";
import { accounts } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";

export const createAccount = async (data) => {
  const [acc] = await db.insert(accounts).values(data).returning();
  return acc;
};

export const findAccount = async (provider, providerId) => {
  const [acc] = await db
    .select()
    .from(accounts)
    .where(
      and(
        eq(accounts.provider, provider),
        eq(accounts.providerId, providerId)
      )
    );

  return acc;
};

export const findAccountsByUserId = async (userId) => {
  return db.select().from(accounts).where(eq(accounts.userId, userId));
};