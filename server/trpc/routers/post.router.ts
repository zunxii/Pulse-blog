import { router, publicProcedure } from "../index";
import { z } from "zod";
import { PostService } from "../../services/post.service";
import { TRPCError } from "@trpc/server";

const postService = new PostService();

export const postRouter = router({
  getAll: publicProcedure
    .input(z.object({
      published: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      try {
        return await postService.getAllPosts(input);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch posts',
          cause: error,
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        const post = await postService.getPostBySlug(input.id);
        return post;
      } catch (error) {
        if (error instanceof Error && error.message === 'Post not found') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch post',
          cause: error,
        });
      }
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        return await postService.getPostBySlug(input.slug);
      } catch (error) {
        if (error instanceof Error && error.message === 'Post not found') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch post',
          cause: error,
        });
      }
    }),

  create: publicProcedure
    .input(z.object({
      title: z.string().min(1, "Title is required").max(255, "Title too long"),
      content: z.string().min(1, "Content is required"),
      excerpt: z.string().max(500).optional(),
      coverImage: z.union([
        z.string().url("Invalid image URL"),
        z.literal(""),
        z.null()
      ]).optional(),
      published: z.boolean().default(false),
      categoryIds: z.array(z.string().uuid()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { coverImage, ...rest } = input;
        return await postService.createPost({
          ...rest,
          coverImage: coverImage === "" ? undefined : coverImage || undefined,
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create post',
          cause: error,
        });
      }
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      title: z.string().min(1).max(255).optional(),
      content: z.string().min(1).optional(),
      excerpt: z.string().max(500).optional(),
      coverImage: z.union([
        z.string().url(),
        z.literal(""),
        z.null()
      ]).optional(),
      published: z.boolean().optional(),
      categoryIds: z.array(z.string().uuid()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { id, coverImage, ...data } = input;
        return await postService.updatePost(id, {
          ...data,
          coverImage: coverImage === "" ? undefined : coverImage || undefined,
        });
      } catch (error) {
        if (error instanceof Error && error.message === 'Post not found') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update post',
          cause: error,
        });
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        return await postService.deletePost(input.id);
      } catch (error) {
        if (error instanceof Error && error.message === 'Post not found') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete post',
          cause: error,
        });
      }
    }),

  saveDraft: publicProcedure
    .input(z.object({
      id: z.string().uuid().optional(),
      title: z.string().min(1).max(255),
      content: z.string().min(1),
      excerpt: z.string().max(500).optional(),
      coverImage: z.union([
        z.string().url(),
        z.literal(""),
        z.null()
      ]).optional(),
      categoryIds: z.array(z.string().uuid()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { coverImage, ...rest } = input;
        return await postService.saveDraft({
          ...rest,
          coverImage: coverImage === "" ? undefined : coverImage || undefined,
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save draft',
          cause: error,
        });
      }
    }),

  like: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        return await postService.likePost(input.id);
      } catch (error) {
        if (error instanceof Error && error.message === 'Post not found') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to like post',
          cause: error,
        });
      }
    }),

  search: publicProcedure
    .input(z.object({
      query: z.string().min(1, "Search query is required").max(100),
      limit: z.number().min(1).max(100).default(10),
    }))
    .query(async ({ input }) => {
      try {
        return await postService.searchPosts(input.query, input.limit);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Search failed',
          cause: error,
        });
      }
    }),

  togglePublish: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      published: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await postService.updatePost(input.id, { 
          published: input.published 
        });
      } catch (error) {
        if (error instanceof Error && error.message === 'Post not found') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to toggle publish status',
          cause: error,
        });
      }
    }),
});