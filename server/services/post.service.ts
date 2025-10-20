import { PostRepository } from "../repositories/post.repository";
import { formatDate } from "@/lib/utils";

export class PostService {
  private postRepository: PostRepository;

  constructor() {
    this.postRepository = new PostRepository();
  }

  async getAllPosts(filters?: {
    published?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const posts = await this.postRepository.findAll(filters);
    
    return posts.map((p) => this.formatPostResponse(p));
  }

  async getPostById(id: string) {
    const result = await this.postRepository.findById(id);
    
    if (!result) {
      throw new Error("Post not found");
    }

    return this.formatPostResponse(result);
  }

  async getPostBySlug(slug: string) {
    const result = await this.postRepository.findBySlug(slug);
    
    if (!result) {
      throw new Error("Post not found");
    }

    // Increment views
    await this.postRepository.incrementViews(result.post.id);

    return this.formatPostResponse(result, true);
  }

  async createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
    categoryIds?: string[];
  }) {
    const readTime = this.calculateReadTime(data.content);
    
    const post = await this.postRepository.create({
      ...data,
      readTime,
      authorName: "Anonymous", // TODO: Get from auth context
      authorUsername: "anonymous",
    });

    return { success: true, post };
  }

  async updatePost(id: string, data: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
    categoryIds?: string[];
  }) {
    const updates: any = { ...data };
    
    if (data.content) {
      updates.readTime = this.calculateReadTime(data.content);
    }

    const post = await this.postRepository.update(id, updates);
    
    return { success: true, post };
  }

  async deletePost(id: string) {
    await this.postRepository.delete(id);
    return { success: true };
  }

  async saveDraft(data: {
    id?: string;
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    categoryIds?: string[];
  }) {
    const readTime = this.calculateReadTime(data.content);

    if (data.id) {
      await this.postRepository.update(data.id, {
        ...data,
        readTime,
        published: false,
      });
      return { success: true, id: data.id };
    } else {
      const post = await this.postRepository.create({
        ...data,
        readTime,
        published: false,
      });
      return { success: true, id: post.id };
    }
  }

  async likePost(id: string) {
    await this.postRepository.incrementLikes(id);
    return { success: true };
  }

  async searchPosts(query: string, limit = 10) {
    const posts = await this.postRepository.search(query, limit);
    
    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || post.content.substring(0, 200),
      coverImage: post.coverImage,
      publishedAt: formatDate(post.publishedAt || post.createdAt),
    }));
  }

  private formatPostResponse(data: any, incrementViews = false) {
    return {
      id: data.post.id,
      title: data.post.title,
      slug: data.post.slug,
      content: data.post.content,
      excerpt: data.post.excerpt || data.post.content.substring(0, 200) + "...",
      coverImage: data.post.coverImage,
      author: {
        name: data.post.authorName || "Anonymous",
        username: data.post.authorUsername || "anonymous",
        avatar: data.post.authorAvatar,
      },
      readTime: data.post.readTime || "5 min read",
      publishedAt: formatDate(data.post.publishedAt || data.post.createdAt),
      tags: data.categories || [],
      likes: data.post.likes || 0,
      comments: data.post.commentsCount || 0,
      views: (data.post.views || 0) + (incrementViews ? 1 : 0),
      published: data.post.published,
      createdAt: data.post.createdAt,
      updatedAt: data.post.updatedAt,
    };
  }

  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }
}
