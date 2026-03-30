
import {
    pgTable,
    serial,
    text,
    boolean,
    timestamp,
    integer,
    uniqueIndex,
    index
} from "drizzle-orm/pg-core";


// ================= USERS =================
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),

    twoFactorEnabled: boolean("two_factor_enabled").default(false),
    twoFactorSecret: text("two_factor_secret"),
});


// ================= ACCOUNTS =================
export const accounts = pgTable(
    "accounts",
    {
        id: serial("id").primaryKey(),
        userId: integer("user_id").notNull(),

        type: text("type").notNull(),         // email | phone | oauth
        provider: text("provider").notNull(), // local | google | phone


        providerId: text("provider_id").notNull(),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
        providerUnique: uniqueIndex("provider_providerId_unique")
            .on(table.provider, table.providerId),

        providerIdx: index("provider_idx")
            .on(table.provider, table.providerId),
    })
);


// ================= VERIFICATIONS =================
export const verifications = pgTable("verifications", {
    id: serial("id").primaryKey(),
    identifier: text("identifier").notNull(),
    type: text("type"),
    code: text("code").notNull(),
    expiresAt: timestamp("expires_at"),
});


// ================= SESSIONS =================
export const sessions = pgTable("sessions", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    refreshToken: text("refresh_token").notNull(),
    expiresAt: timestamp("expires_at"),
});