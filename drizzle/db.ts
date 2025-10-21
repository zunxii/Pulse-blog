import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

// Create postgres client with better configuration
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false, // Important for Supabase
  onnotice: () => {},
});

export const db = drizzle(client, { schema });

// Export types
export type DB = typeof db;

// Graceful shutdown
export async function closeConnection() {
  await client.end();
}

if (typeof process !== 'undefined') {
  process.on('SIGTERM', closeConnection);
  process.on('SIGINT', closeConnection);
}