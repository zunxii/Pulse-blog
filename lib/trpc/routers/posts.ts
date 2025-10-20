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

// Input validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string()).optional(),
  authorName: z.string().default("Anonymous"),
  authorUsername: z.string().default("anonymous"),
});

const updatePostSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
});

const postQuerySchema = z.object({
  published: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const postsRouter = router({
  // Get all posts with pagination
  getAll: publicProcedure
    .input(postQuerySchema.optional())
    .query(async ({ input }) => {
      try {
        const posts = await getAllPosts(input);
        return posts.map((p) => ({
          id: p.post.id,
          title: p.post.title,
          slug: p.post.slug,
          excerpt: p.post.excerpt || p.post.content.substring(0, 200) + "...",
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
          createdAt: p.post.createdAt,
          updatedAt: p.post.updatedAt,
        }));
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Failed to fetch posts");
      }
    }),

  // Get single post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const result = await getPostBySlug(input.slug);
        if (!result) {
          throw new Error("Post not found");
        }

        // Increment views asynchronously
        incrementPostViews(result.post.id).catch(console.error);

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
          views: (result.post.views || 0) + 1,
          published: result.post.published,
        };
      } catch (error) {
        console.error("Error fetching post:", error);
        throw new Error("Failed to fetch post");
      }
    }),

  // Get single post by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const result = await getPostById(input.id);
        if (!result) {
          throw new Error("Post not found");
        }

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
          createdAt: result.post.createdAt,
          updatedAt: result.post.updatedAt,
        };
      } catch (error) {
        console.error("Error fetching post:", error);
        throw new Error("Failed to fetch post");
      }
    }),

  // Create new post
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => {
      try {
        const post = await createPost(input);
        return {
          success: true,
          post: {
            id: post.id,
            slug: post.slug,
          },
        };
      } catch (error) {
        console.error("Error creating post:", error);
        throw new Error("Failed to create post");
      }
    }),

  // Update existing post
  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        const post = await updatePost(id, data);
        return {
          success: true,
          post: {
            id: post.id,
            slug: post.slug,
          },
        };
      } catch (error) {
        console.error("Error updating post:", error);
        throw new Error("Failed to update post");
      }
    }),

  // Delete post
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await deletePost(input.id);
        return { success: true };
      } catch (error) {
        console.error("Error deleting post:", error);
        throw new Error("Failed to delete post");
      }
    }),

  // Toggle publish status
  togglePublish: publicProcedure
    .input(z.object({ 
      id: z.string(),
      published: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      try {
        await updatePost(input.id, { published: input.published });
        return { success: true };
      } catch (error) {
        console.error("Error toggling publish status:", error);
        throw new Error("Failed to update publish status");
      }
    }),

  // Like post
  like: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await incrementPostLikes(input.id);
        return { success: true };
      } catch (error) {
        console.error("Error liking post:", error);
        throw new Error("Failed to like post");
      }
    }),

  // Search posts
  search: publicProcedure
    .input(z.object({ 
      query: z.string().min(1),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ input }) => {
      try {
        const posts = await searchPosts(input.query);
        return posts.slice(0, input.limit).map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || post.content.substring(0, 200),
          coverImage: post.coverImage,
          publishedAt: formatDate(post.publishedAt || post.createdAt),
        }));
      } catch (error) {
        console.error("Error searching posts:", error);
        throw new Error("Failed to search posts");
      }
    }),

  // Get posts by category
  getByCategory: publicProcedure
    .input(z.object({ 
      categorySlug: z.string(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      try {
        const posts = await getPostsByCategory(input.categorySlug);
        return posts.slice(0, input.limit).map((p) => ({
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
      } catch (error) {
        console.error("Error fetching posts by category:", error);
        throw new Error("Failed to fetch posts");
      }
    }),

  // Save draft (auto-save)
  saveDraft: publicProcedure
    .input(z.object({
      id: z.string().optional(),
      title: z.string(),
      content: z.string(),
      excerpt: z.string().optional(),
      coverImage: z.string().optional(),
      categoryIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        if (input.id) {
          // Update existing draft
          await updatePost(input.id, {
            ...input,
            published: false,
          });
          return { success: true, id: input.id };
        } else {
          // Create new draft
          const post = await createPost({
            ...input,
            published: false,
          });
          return { success: true, id: post.id };
        }
      } catch (error) {
        console.error("Error saving draft:", error);
        throw new Error("Failed to save draft");
      }
    }),
});