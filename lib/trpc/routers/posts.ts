import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import {
  getAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  incrementPostViews,
  incrementPostLikes,
  searchPosts,
  getPostsByCategory,
} from "@/lib/db/queries";
import { formatDate } from "@/lib/utils";

export const postsRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        published: z.boolean().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const posts = await getAllPosts(input);
      return posts.map((p) => ({
        id: p.post.id,
        title: p.post.title,
        slug: p.post.slug,
        excerpt: p.post.excerpt || "",
        coverImage: p.post.coverImage,
        author: {
          name: p.post.authorName || "Anonymous",
          username: p.post.authorUsername || "anonymous",
          avatar: p.post.authorAvatar,
        },
        readTime: p.post.readTime || "5 min read",
        publishedAt: formatDate(p.post.publishedAt || p.post.createdAt),
        tags: p.categories || [],
        likes: p.post.likes || 0,
        comments: p.post.commentsCount || 0,
        views: p.post.views || 0,
        published: p.post.published,
      }));
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const result = await getPostBySlug(input.slug);
      if (!result) return null;

      // Increment views
      await incrementPostViews(result.post.id);

      return {
        id: result.post.id,
        title: result.post.title,
        slug: result.post.slug,
        content: result.post.content,
        excerpt: result.post.excerpt,
        coverImage: result.post.coverImage,
        author: {
          name: result.post.authorName || "Anonymous",
          username: result.post.authorUsername || "anonymous",
          avatar: result.post.authorAvatar,
          bio: result.post.authorBio,
          followers: result.post.authorFollowers || 0,
        },
        readTime: result.post.readTime || "5 min read",
        publishedAt: formatDate(result.post.publishedAt || result.post.createdAt),
        tags: result.categories || [],
        likes: result.post.likes || 0,
        comments: result.post.commentsCount || 0,
        views: result.post.views || 0,
        published: result.post.published,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await getPostById(input.id);
      if (!result) return null;

      return {
        id: result.post.id,
        title: result.post.title,
        slug: result.post.slug,
        content: result.post.content,
        excerpt: result.post.excerpt,
        coverImage: result.post.coverImage,
        author: {
          name: result.post.authorName || "Anonymous",
          username: result.post.authorUsername || "anonymous",
          avatar: result.post.authorAvatar,
          bio: result.post.authorBio,
          followers: result.post.authorFollowers || 0,
        },
        readTime: result.post.readTime || "5 min read",
        publishedAt: formatDate(result.post.publishedAt || result.post.createdAt),
        tags: result.categories || [],
        likes: result.post.likes || 0,
        comments: result.post.commentsCount || 0,
        views: result.post.views || 0,
        published: result.post.published,
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        published: z.boolean().optional(),
        categoryIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await createPost(input);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        published: z.boolean().optional(),
        categoryIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await updatePost(id, data);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await deletePost(input.id);
      return { success: true };
    }),

  like: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await incrementPostLikes(input.id);
      return { success: true };
    }),

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return await searchPosts(input.query);
    }),

  getByCategory: publicProcedure
    .input(z.object({ categorySlug: z.string() }))
    .query(async ({ input }) => {
      const posts = await getPostsByCategory(input.categorySlug);
      return posts.map((p) => ({
        id: p.post.id,
        title: p.post.title,
        slug: p.post.slug,
        excerpt: p.post.excerpt || "",
        coverImage: p.post.coverImage,
        author: {
          name: p.post.authorName || "Anonymous",
          username: p.post.authorUsername || "anonymous",
          avatar: p.post.authorAvatar,
        },
        readTime: p.post.readTime || "5 min read",
        publishedAt: formatDate(p.post.publishedAt || p.post.createdAt),
        tags: p.categories || [],
        likes: p.post.likes || 0,
        comments: p.post.commentsCount || 0,
        views: p.post.views || 0,
      }));
    }),
});