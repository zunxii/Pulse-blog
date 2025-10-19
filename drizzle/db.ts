import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config();
const host = "aws-1-us-east-1.pooler.supabase.com";
const port = 6543;
const database = "postgres";
const username = "postgres.jlqwbxzwrfaiymcrpxsm";
const password = process.env.DB_PASSWORD;

if (!password) {
  throw new Error("DB_PASSWORD is not set in .env file");
}

const client = postgres({
  host,
  port,
  database,
  username,
  password,
  ssl: false,
  prepare: false,
});

export const db = drizzle(client, { schema });