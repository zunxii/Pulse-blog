import { db } from "@/drizzle/db";
import { posts, categories, postCategories, comments } from "@/drizzle/schema";
import { eq, desc, and, sql, like, inArray } from "drizzle-orm";

// Post queries
export async function getAllPosts(options?: {
  published?: boolean;
  limit?: number;
  offset?: number;
}) {
  const conditions = [];
  if (options?.published !== undefined) {
    conditions.push(eq(posts.published, options.published));
  }

  const query = db
    .select({
      post: posts,
      categories: sql<string[]>`
        COALESCE(
          array_agg(DISTINCT ${categories.name}) FILTER (WHERE ${categories.name} IS NOT NULL),
          '{}'
        )
      `.as("categories"),
    })
    .from(posts)
    .leftJoin(postCategories, eq(posts.id, postCategories.postId))
    .leftJoin(categories, eq(postCategories.categoryId, categories.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(posts.id)
    .orderBy(desc(posts.createdAt));

  if (options?.limit) {
    query.limit(options.limit);
  }
  if (options?.offset) {
    query.offset(options.offset);
  }

  return await query;
}

export async function getPostBySlug(slug: string) {
  const result = await db
    .select({
      post: posts,
      categories: sql<string[]>`
        COALESCE(
          array_agg(DISTINCT ${categories.name}) FILTER (WHERE ${categories.name} IS NOT NULL),
          '{}'
        )
      `.as("categories"),
    })
    .from(posts)
    .leftJoin(postCategories, eq(posts.id, postCategories.postId))
    .leftJoin(categories, eq(postCategories.categoryId, categories.id))
    .where(eq(posts.slug, slug))
    .groupBy(posts.id)
    .limit(1);

  return result[0] || null;
}

export async function getPostById(id: string) {
  const result = await db
    .select({
      post: posts,
      categories: sql<string[]>`
        COALESCE(
          array_agg(DISTINCT ${categories.name}) FILTER (WHERE ${categories.name} IS NOT NULL),
          '{}'
        )
      `.as("categories"),
    })
    .from(posts)
    .leftJoin(postCategories, eq(posts.id, postCategories.postId))
    .leftJoin(categories, eq(postCategories.categoryId, categories.id))
    .where(eq(posts.id, id))
    .groupBy(posts.id)
    .limit(1);

  return result[0] || null;
}

export async function createPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  authorName?: string;
  authorUsername?: string;
  categoryIds?: string[];
}) {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const readTime = calculateReadTime(data.content);

  const [post] = await db
    .insert(posts)
    .values({
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      coverImage: data.coverImage,
      published: data.published || false,
      authorName: data.authorName || "Anonymous",
      authorUsername: data.authorUsername || "anonymous",
      readTime,
      publishedAt: data.published ? new Date() : null,
    })
    .returning();

  // Add categories
  if (data.categoryIds && data.categoryIds.length > 0) {
    await db.insert(postCategories).values(
      data.categoryIds.map((categoryId) => ({
        postId: post.id,
        categoryId,
      }))
    );
  }

  return post;
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
    categoryIds?: string[];
  }
) {
  const updates: any = { ...data, updatedAt: new Date() };

  if (data.title) {
    updates.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  if (data.content) {
    updates.readTime = calculateReadTime(data.content);
  }

  if (data.published === true) {
    updates.publishedAt = new Date();
  }

  const [post] = await db
    .update(posts)
    .set(updates)
    .where(eq(posts.id, id))
    .returning();

  // Update categories if provided
  if (data.categoryIds) {
    await db.delete(postCategories).where(eq(postCategories.postId, id));
    if (data.categoryIds.length > 0) {
      await db.insert(postCategories).values(
        data.categoryIds.map((categoryId) => ({
          postId: id,
          categoryId,
        }))
      );
    }
  }

  return post;
}

export async function deletePost(id: string) {
  await db.delete(posts).where(eq(posts.id, id));
}

export async function incrementPostViews(id: string) {
  await db
    .update(posts)
    .set({ views: sql`${posts.views} + 1` })
    .where(eq(posts.id, id));
}

export async function incrementPostLikes(id: string) {
  await db
    .update(posts)
    .set({ likes: sql`${posts.likes} + 1` })
    .where(eq(posts.id, id));
}

// Category queries
export async function getAllCategories() {
  return await db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function createCategory(data: {
  name: string;
  description?: string;
}) {
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const [category] = await db
    .insert(categories)
    .values({
      name: data.name,
      slug,
      description: data.description,
    })
    .returning();

  return category;
}

// Comment queries
export async function getPostComments(postId: string) {
  return await db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));
}

export async function createComment(data: {
  postId: string;
  content: string;
  authorName: string;
  authorUsername: string;
  parentId?: string;
}) {
  const [comment] = await db.insert(comments).values(data).returning();

  // Increment comments count on post
  await db
    .update(posts)
    .set({ commentsCount: sql`${posts.commentsCount} + 1` })
    .where(eq(posts.id, data.postId));

  return comment;
}

// Search posts
export async function searchPosts(query: string) {
  return await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.published, true),
        sql`${posts.title} ILIKE ${`%${query}%`} OR ${posts.content} ILIKE ${`%${query}%`}`
      )
    )
    .orderBy(desc(posts.createdAt));
}

// Filter posts by category
export async function getPostsByCategory(categorySlug: string) {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];

  const result = await db
    .select({
      post: posts,
      categories: sql<string[]>`
        COALESCE(
          array_agg(DISTINCT ${categories.name}) FILTER (WHERE ${categories.name} IS NOT NULL),
          '{}'
        )
      `.as("categories"),
    })
    .from(posts)
    .innerJoin(postCategories, eq(posts.id, postCategories.postId))
    .leftJoin(categories, eq(postCategories.categoryId, categories.id))
    .where(
      and(
        eq(posts.published, true),
        eq(postCategories.categoryId, category.id)
      )
    )
    .groupBy(posts.id)
    .orderBy(desc(posts.createdAt));

  return result;
}

// Utility function
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}