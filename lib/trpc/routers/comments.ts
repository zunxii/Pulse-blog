import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { getPostComments, createComment } from "@/lib/db/queries";
import { formatDate } from "@/lib/utils";

export const commentsRouter = router({
  getByPost: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input }) => {
      const comments = await getPostComments(input.postId);
      
      // Group comments by parentId
      const commentMap = new Map();
      const rootComments: any[] = [];

      comments.forEach((comment) => {
        commentMap.set(comment.id, {
          id: comment.id,
          author: {
            name: comment.authorName,
            username: comment.authorUsername,
            avatar: comment.authorAvatar,
          },
          content: comment.content,
          timestamp: formatDate(comment.createdAt),
          likes: comment.likes || 0,
          replies: [],
        });
      });

      comments.forEach((comment) => {
        const commentObj = commentMap.get(comment.id);
        if (comment.parentId) {
          const parent = commentMap.get(comment.parentId);
          if (parent) {
            parent.replies.push(commentObj);
          }
        } else {
          rootComments.push(commentObj);
        }
      });

      return rootComments;
    }),

  create: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string().min(1),
        authorName: z.string().default("Anonymous"),
        authorUsername: z.string().default("anonymous"),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await createComment(input);
    }),
});