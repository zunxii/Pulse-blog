import { router } from "./trpc";
import { postsRouter } from "./routers/posts";
import { categoriesRouter } from "./routers/categories";
import { commentsRouter } from "./routers/comments";

export const appRouter = router({
  posts: postsRouter,
  categories: categoriesRouter,
  comments: commentsRouter,
});

export type AppRouter = typeof appRouter;