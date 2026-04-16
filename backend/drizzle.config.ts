import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts", // adjust if needed
  out: "./drizzle",
  dialect: "postgresql", // ✅ REQUIRED
  dbCredentials: {
    url: process.env.DATABASE_URL!, // ✅ also changed from connectionString → url
  },
});