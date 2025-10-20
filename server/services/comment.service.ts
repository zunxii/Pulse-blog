import { CommentRepository } from "../repositories/comment.repository";
import { formatDate } from "@/lib/utils";

export class CommentService {
  private commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async getCommentsByPostId(postId: string) {
    const comments = await this.commentRepository.findByPostId(postId);
    
    // Group comments by parentId
    const commentMap = new Map();
    const rootComments: any[] = [];

    comments.forEach((comment) => {
      commentMap.set(comment.id, {
        id: comment.id,
        author: {
          name: comment.authorName,
          username: comment.authorUsername,
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
  }

  async createComment(data: {
    postId: string;
    content: string;
    authorName: string;
    authorUsername: string;
    parentId?: string;
  }) {
    const comment = await this.commentRepository.create(data);
    return comment;
  }

  async deleteComment(id: string) {
    await this.commentRepository.delete(id);
    return { success: true };
  }
}
