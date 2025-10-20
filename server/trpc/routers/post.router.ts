import { router, publicProcedure } from "../index";
import { z } from "zod";
import { PostService } from "../../services/post.service";

const postService = new PostService();

export const postRouter = router({
  getAll: publicProcedure
    .input(z.object({
      published: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      return await postService.getAllPosts(input);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await postService.getPostById(input.id);
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await postService.getPostBySlug(input.slug);
    }),

  create: publicProcedure
    .input(z.object({
      title: z.string().min(1).max(255),
      content: z.string().min(1),
      excerpt: z.string().optional(),
      coverImage: z.string().url().optional().or(z.literal("")),
      published: z.boolean().default(false),
      categoryIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      return await postService.createPost(input);
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).max(255).optional(),
      content: z.string().min(1).optional(),
      excerpt: z.string().optional(),
      coverImage: z.string().url().optional().or(z.literal("")),
      published: z.boolean().optional(),
      categoryIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await postService.updatePost(id, data);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await postService.deletePost(input.id);
    }),

  saveDraft: publicProcedure
    .input(z.object({
      id: z.string().optional(),
      title: z.string().min(1).max(255),
      content: z.string().min(1),
      excerpt: z.string().optional(),
      coverImage: z.string().url().optional().or(z.literal("")),
      categoryIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      return await postService.saveDraft(input);
    }),

  like: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await postService.likePost(input.id);
    }),

  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      limit: z.number().min(1).max(100).default(10),
    }))
    .query(async ({ input }) => {
      return await postService.searchPosts(input.query, input.limit);
    }),
  togglePublish: publicProcedure
    .input(z.object({
      id: z.string(),
      published: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      return await postService.updatePost(input.id, { published: input.published });
    }),
});
    