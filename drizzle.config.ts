import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: "aws-1-us-east-1.pooler.supabase.com",
    port: 6543,
    user: "postgres.jlqwbxzwrfaiymcrpxsm",
    password: process.env.DB_PASSWORD || dbUrl.split(":")[2]?.split("@")[0],
    database: "postgres",
    ssl: false,
  },
} satisfies Config;