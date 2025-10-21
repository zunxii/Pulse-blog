import { db } from "../db";
import { comments, posts } from "../db/schema";
import { eq, desc, sql, isNull } from "drizzle-orm";

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
    authorAvatar?: string;
    parentId?: string;
  }) {
    return await db.transaction(async (tx) => {
      if (data.parentId) {
        const [parent] = await tx
          .select({ id: comments.id, postId: comments.postId })
          .from(comments)
          .where(eq(comments.id, data.parentId))
          .limit(1);

        if (!parent) {
          throw new Error("Parent comment not found");
        }

        if (parent.postId !== data.postId) {
          throw new Error("Parent comment belongs to different post");
        }
      }

      const [comment] = await tx
        .insert(comments)
        .values(data)
        .returning();

      await tx
        .update(posts)
        .set({ commentsCount: sql`${posts.commentsCount} + 1` })
        .where(eq(posts.id, data.postId));

      return comment;
    });
  }

  async delete(id: string) {
    return await db.transaction(async (tx) => {
      const [comment] = await tx
        .select()
        .from(comments)
        .where(eq(comments.id, id))
        .limit(1);

      if (!comment) {
        throw new Error("Comment not found");
      }

      const nestedComments = await this.getNestedCommentIds(id);
      const totalToDelete = nestedComments.length + 1;

      await tx.delete(comments).where(eq(comments.id, id));

      await tx
        .update(posts)
        .set({ commentsCount: sql`GREATEST(0, ${posts.commentsCount} - ${totalToDelete})` })
        .where(eq(posts.id, comment.postId));

      return comment;
    });
  }

  private async getNestedCommentIds(parentId: string): Promise<string[]> {
    const children = await db
      .select({ id: comments.id })
      .from(comments)
      .where(eq(comments.parentId, parentId));

    let allIds: string[] = [];
    
    for (const child of children) {
      allIds.push(child.id);
      const nested = await this.getNestedCommentIds(child.id);
      allIds = allIds.concat(nested);
    }

    return allIds;
  }

  async incrementLikes(id: string) {
    await db
      .update(comments)
      .set({ likes: sql`${comments.likes} + 1` })
      .where(eq(comments.id, id));
  }
}