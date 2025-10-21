import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/root";
import { createTRPCContext } from "@/server/trpc/context";

const handler = async (req: Request) => {
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
            }
          : undefined,
    });
  } catch (error) {
    console.error("TRPC Handler Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export { handler as GET, handler as POST };
// export const runtime = 'nodejs';
// export const dynamic = 'force-dynamic';