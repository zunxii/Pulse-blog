import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;
console.log("DATABASE_URL:", connectionString);
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const globalForDb = globalThis as unknown as {
  connection: ReturnType<typeof postgres> | undefined;
};

function getConnection() {
  if (!globalForDb.connection) {
    globalForDb.connection = postgres(connectionString!, {
      max: 1, 
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false, 
      onnotice: () => {}, 
      connection: {
        application_name: 'pulse_blog',
      },
    });
  }
  return globalForDb.connection;
}

export const db = drizzle(getConnection(), { schema });

export const connection = getConnection();

if (typeof process !== 'undefined') {
  const cleanup = async () => {
    if (globalForDb.connection) {
      await globalForDb.connection.end({ timeout: 5 });
      globalForDb.connection = undefined;
    }
  };

  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
  process.on('beforeExit', cleanup);
}