import { CommentRepository } from "../repositories/comment.repository";

interface CommentAuthor {
  name: string;
  username: string;
  avatar?: string | null;
}

interface CommentWithReplies {
  id: string;
  author: CommentAuthor;
  content: string;
  timestamp: string;
  likes: number;
  replies: CommentWithReplies[];
}

export class CommentService {
  private commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async getCommentsByPostId(postId: string): Promise<CommentWithReplies[]> {
    const comments = await this.commentRepository.findByPostId(postId);
    
    // Build comment tree
    const commentMap = new Map<string, CommentWithReplies>();
    const rootComments: CommentWithReplies[] = [];

    // First pass: create all comment objects
    comments.forEach((comment) => {
      commentMap.set(comment.id, {
        id: comment.id,
        author: {
          name: comment.authorName,
          username: comment.authorUsername,
          avatar: comment.authorAvatar,
        },
        content: comment.content,
        timestamp: this.formatTimestamp(comment.createdAt),
        likes: comment.likes || 0,
        replies: [],
      });
    });

    // Second pass: build tree structure
    comments.forEach((comment) => {
      const commentObj = commentMap.get(comment.id)!;
      
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentObj);
        } else {
          // Orphaned comment - log warning and add to root
          console.warn(`Orphaned comment ${comment.id} with missing parent ${comment.parentId}`);
          rootComments.push(commentObj);
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
    authorAvatar?: string;
    parentId?: string;
  }) {
    try {
      const comment = await this.commentRepository.create(data);
      return {
        success: true,
        comment: {
          id: comment.id,
          author: {
            name: comment.authorName,
            username: comment.authorUsername,
            avatar: comment.authorAvatar,
          },
          content: comment.content,
          timestamp: this.formatTimestamp(comment.createdAt),
          likes: comment.likes || 0,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create comment: ${error.message}`);
      }
      throw error;
    }
  }

  async deleteComment(id: string) {
    try {
      await this.commentRepository.delete(id);
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete comment: ${error.message}`);
      }
      throw error;
    }
  }

  async likeComment(id: string) {
    await this.commentRepository.incrementLikes(id);
    return { success: true };
  }

  private formatTimestamp(date: Date | null): string {
    if (!date) return "Just now";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSeconds < 60) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: diffDays > 365 ? 'numeric' : undefined 
    });
  }
}