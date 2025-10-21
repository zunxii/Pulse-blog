import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const queryClient = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
});

export const db = drizzle(queryClient, { schema });

if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    await queryClient.end({ timeout: 5 });
  });
  
  process.on('SIGINT', async () => {
    await queryClient.end({ timeout: 5 });
  });
}