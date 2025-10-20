import { CommentService } from "@/server/services/comment.service";
import { router, publicProcedure } from "../index";
import z from "zod";
import { create } from "domain";

const commentService = new CommentService();

export const commentRouter = router({

    getByPostId : publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input }) => {
      return await commentService.getCommentsByPostId(input.postId);
    }),

    create : publicProcedure
    .input(z.object({
      postId: z.string(),
      content: z.string().min(1),
      authorName: z.string().min(1).max(100),
      authorUsername: z.string().min(1).max(100),
      parentId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await commentService.createComment(input);
    }),

    delete : publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await commentService.deleteComment(input.id);
    }),
})