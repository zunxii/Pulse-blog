import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

let connection: ReturnType<typeof postgres> | null = null;

function getConnection() {
  if (!connection) {
    connection = postgres(connectionString!, {
      max: 10, 
      idle_timeout: 20, 
      connect_timeout: 10, 
      prepare: true, 
      onnotice: () => {}, 
      connection: {
        application_name: 'pulse_blog',
      },
    });
  }
  return connection;
}

export const db = drizzle(getConnection(), { schema });

// Graceful shutdown
export async function closeConnection() {
  if (connection) {
    await connection.end();
    connection = null;
  }
}

// Handle process termination
if (typeof process !== 'undefined') {
  process.on('SIGTERM', closeConnection);
  process.on('SIGINT', closeConnection);
}