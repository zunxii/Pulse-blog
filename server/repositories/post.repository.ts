import { db } from "../db";
import { posts, categories, postCategories } from "../db/schema";
import { eq, desc, and, sql, like } from "drizzle-orm";

export class PostRepository {
  async findAll(filters?: {
    published?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const conditions = [];
    
    if (filters?.published !== undefined) {
      conditions.push(eq(posts.published, filters.published));
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

    if (filters?.limit) query.limit(filters.limit);
    if (filters?.offset) query.offset(filters.offset);

    return await query;
  }

  async findById(id: string) {
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

  async findBySlug(slug: string) {
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

  async create(data: {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
    authorName?: string;
    authorUsername?: string;
    readTime: string;
    categoryIds?: string[];
  }) {
    const slug = this.generateSlug(data.title);

    const [post] = await db
      .insert(posts)
      .values({
        ...data,
        slug,
        publishedAt: data.published ? new Date() : null,
      })
      .returning();

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

  async update(id: string, data: Partial<{
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    published: boolean;
    readTime: string;
    categoryIds: string[];
  }>) {
    const updates: any = { 
      ...data, 
      updatedAt: new Date() 
    };

    if (data.title) {
      updates.slug = this.generateSlug(data.title);
    }

    if (data.published === true) {
      updates.publishedAt = new Date();
    } else if (data.published === false) {
      updates.publishedAt = null;
    }

    const [post] = await db
      .update(posts)
      .set(updates)
      .where(eq(posts.id, id))
      .returning();

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

  async delete(id: string) {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async incrementViews(id: string) {
    await db
      .update(posts)
      .set({ views: sql`${posts.views} + 1` })
      .where(eq(posts.id, id));
  }

  async incrementLikes(id: string) {
    await db
      .update(posts)
      .set({ likes: sql`${posts.likes} + 1` })
      .where(eq(posts.id, id));
  }

  async search(query: string, limit = 10) {
    return await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.published, true),
          sql`${posts.title} ILIKE ${`%${query}%`} OR ${posts.content} ILIKE ${`%${query}%`}`
        )
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}
