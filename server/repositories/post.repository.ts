import { db } from "../db";
import { posts, categories, postCategories } from "../db/schema";
import { eq, desc, and, sql, or, ilike } from "drizzle-orm";

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
      .select()
      .from(posts)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(posts.createdAt))
      .limit(filters?.limit || 20)
      .offset(filters?.offset || 0);

    const postsData = await query;

    if (postsData.length === 0) return [];

    const postIds = postsData.map(p => p.id);
    
    const postCategoriesData = await db
      .select({
        postId: postCategories.postId,
        categoryName: categories.name,
      })
      .from(postCategories)
      .innerJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(sql`${postCategories.postId} = ANY(${postIds})`);

    const categoriesByPost = new Map<string, string[]>();
    postCategoriesData.forEach(({ postId, categoryName }) => {
      if (!categoriesByPost.has(postId)) {
        categoriesByPost.set(postId, []);
      }
      categoriesByPost.get(postId)!.push(categoryName);
    });

    return postsData.map(post => ({
      post,
      categories: categoriesByPost.get(post.id) || [],
    }));
  }

  async findById(id: string) {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) return null;

    const categoriesData = await db
      .select({ name: categories.name })
      .from(postCategories)
      .innerJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(eq(postCategories.postId, id));

    return {
      post,
      categories: categoriesData.map(c => c.name),
    };
  }

  async findBySlug(slug: string) {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (!post) return null;

    const categoriesData = await db
      .select({ name: categories.name })
      .from(postCategories)
      .innerJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(eq(postCategories.postId, post.id));

    return {
      post,
      categories: categoriesData.map(c => c.name),
    };
  }

  private async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const conditions = [eq(posts.slug, slug)];
    if (excludeId) {
      conditions.push(sql`${posts.id} != ${excludeId}`);
    }

    const [existing] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(and(...conditions))
      .limit(1);

    return !!existing;
  }

  // Generate unique slug
  private async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let unique = slug;
    let counter = 1;

    while (await this.slugExists(unique, excludeId)) {
      unique = `${slug}-${counter}`;
      counter++;
    }

    return unique;
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
    const slug = await this.generateUniqueSlug(data.title);

    return await db.transaction(async (tx) => {
      const [post] = await tx
        .insert(posts)
        .values({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          coverImage: data.coverImage,
          published: data.published,
          authorName: data.authorName,
          authorUsername: data.authorUsername,
          readTime: data.readTime,
          slug,
          publishedAt: data.published ? new Date() : null,
        })
        .returning();

      if (data.categoryIds && data.categoryIds.length > 0) {
        await tx.insert(postCategories).values(
          data.categoryIds.map((categoryId) => ({
            postId: post.id,
            categoryId,
          }))
        );
      }

      return post;
    });
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
    return await db.transaction(async (tx) => {
      const updates: any = { 
        ...data, 
        updatedAt: new Date() 
      };

      delete updates.categoryIds;

      if (data.title) {
        updates.slug = await this.generateUniqueSlug(data.title, id);
      }

      if (data.published === true) {
        const [existing] = await tx.select({ publishedAt: posts.publishedAt })
          .from(posts)
          .where(eq(posts.id, id))
          .limit(1);
        
        // Only set publishedAt if it wasn't published before
        if (!existing?.publishedAt) {
          updates.publishedAt = new Date();
        }
      } else if (data.published === false) {
        updates.publishedAt = null;
      }

      const [post] = await tx
        .update(posts)
        .set(updates)
        .where(eq(posts.id, id))
        .returning();

      if (data.categoryIds !== undefined) {
        await tx.delete(postCategories).where(eq(postCategories.postId, id));
        
        if (data.categoryIds.length > 0) {
          await tx.insert(postCategories).values(
            data.categoryIds.map((categoryId) => ({
              postId: id,
              categoryId,
            }))
          );
        }
      }

      return post;
    });
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
    const searchTerm = `%${query}%`;
    
    return await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.published, true),
          or(
            ilike(posts.title, searchTerm),
            ilike(posts.content, searchTerm)
          )
        )
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }
}