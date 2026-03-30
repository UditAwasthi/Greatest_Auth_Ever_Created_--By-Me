import "dotenv/config";

export default {
  schema: "./src/db/schema.js",
  out: "./drizzle",

  dialect: "postgresql", // ✅ REQUIRED (THIS FIXES YOUR ERROR)

  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};