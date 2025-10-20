import { db } from "../db";
import { comments, posts } from "../db/schema";
import { eq, desc, sql } from "drizzle-orm";

export class CommentRepository {
  async findByPostId(postId: string) {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));
  }

  async create(data: {
    postId: string;
    content: string;
    authorName: string;
    authorUsername: string;
    parentId?: string;
  }) {
    const [comment] = await db
      .insert(comments)
      .values(data)
      .returning();

    // Increment comment count on post
    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, data.postId));

    return comment;
  }

  async delete(id: string) {
    const [comment] = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();

    if (comment) {
      await db
        .update(posts)
        .set({ commentsCount: sql`${posts.commentsCount} - 1` })
        .where(eq(posts.id, comment.postId));
    }

    return comment;
  }
}