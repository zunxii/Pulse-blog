import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/root";
import { createTRPCContext } from "@/server/trpc/context";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const handler = async (req: NextRequest) => {
  try {
    return await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: createTRPCContext,
      onError:
        process.env.NODE_ENV === "development"
          ? ({ path, error }) => {
              console.error(
                ` tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
              );
              console.error(error);
            }
          : undefined,
    });
  } catch (error) {
    console.error("TRPC Handler Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error"
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
};

export { handler as GET, handler as POST };