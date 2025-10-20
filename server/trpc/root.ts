import { router } from "./index";
import { postRouter } from "./routers/post.router";
import { categoryRouter } from "./routers/category.router";
import { commentRouter } from "./routers/comment.router";

export const appRouter = router({
  post: postRouter,
  categories: categoryRouter,
  comments: commentRouter,
});

export type AppRouter = typeof appRouter;