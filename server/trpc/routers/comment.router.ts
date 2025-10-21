import { CommentService } from "@/server/services/comment.service";
import { router, publicProcedure } from "../index";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const commentService = new CommentService();

export const commentRouter = router({
  getByPostId: publicProcedure
    .input(z.object({ postId: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        return await commentService.getCommentsByPostId(input.postId);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch comments',
          cause: error,
        });
      }
    }),

  create: publicProcedure
    .input(z.object({
      postId: z.string().uuid(),
      content: z.string().min(1, "Comment cannot be empty").max(5000, "Comment too long"),
      authorName: z.string().min(1, "Name is required").max(100, "Name too long"),
      authorUsername: z.string().min(1, "Username is required").max(100, "Username too long"),
      authorAvatar: z.string().url().optional().or(z.literal("")).nullable(),
      parentId: z.string().uuid().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { authorAvatar, ...rest } = input;
        return await commentService.createComment({
          ...rest,
          authorAvatar: authorAvatar === "" ? undefined : authorAvatar || undefined,
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('Parent comment')) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: error.message,
            });
          }
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create comment',
          cause: error,
        });
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        return await commentService.deleteComment(input.id);
      } catch (error) {
        if (error instanceof Error && error.message === 'Comment not found') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Comment not found',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete comment',
          cause: error,
        });
      }
    }),

  like: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        return await commentService.likeComment(input.id);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to like comment',
          cause: error,
        });
      }
    }),
});