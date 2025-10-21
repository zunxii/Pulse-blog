import { PostRepository } from "../repositories/post.repository";

interface PostResponseData {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    published: boolean | null;
    authorName: string | null;
    authorUsername: string | null;
    authorAvatar: string | null;
    authorBio: string | null;
    authorFollowers: number | null;
    readTime: string | null;
    views: number | null;
    likes: number | null;
    commentsCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    publishedAt: Date | null;
  };
  categories: string[];
}

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
    
    return posts.map((p) => this.formatPostResponse(p, false));
  }

  async getPostById(id: string) {
    const result = await this.postRepository.findById(id);
    
    if (!result) {
      throw new Error("Post not found");
    }

    return this.formatPostResponse(result, false);
  }

  async getPostBySlug(slug: string) {
    const result = await this.postRepository.findBySlug(slug);
    
    if (!result) {
      throw new Error("Post not found");
    }

    this.postRepository.incrementViews(result.post.id).catch(err => {
      console.error('Failed to increment views:', err);
    });
    return this.formatPostResponse(result, false);
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

    const existing = await this.postRepository.findById(id);
    if (!existing) {
      throw new Error("Post not found");
    }

    const updates: any = {};

    if (data.title !== undefined) updates.title = data.title;
    if (data.content !== undefined) {
      updates.content = data.content;
      updates.readTime = this.calculateReadTime(data.content);
    }
    if (data.excerpt !== undefined) updates.excerpt = data.excerpt;
    if (data.coverImage !== undefined) updates.coverImage = data.coverImage;
    if (data.published !== undefined) updates.published = data.published;
    if (data.categoryIds !== undefined) updates.categoryIds = data.categoryIds;

    const post = await this.postRepository.update(id, updates);
    
    return { success: true, post };
  }

  async deletePost(id: string) {

    const existing = await this.postRepository.findById(id);
    if (!existing) {
      throw new Error("Post not found");
    }

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

      const { id, ...updateData } = data;
      await this.postRepository.update(id, {
        ...updateData,
        readTime,
        published: false,
      });
      return { success: true, id: data.id };
    } else {

      const { id, ...createData } = data;
      const post = await this.postRepository.create({
        ...createData,
        readTime,
        published: false,
        authorName: "Anonymous",
        authorUsername: "anonymous",
      });
      return { success: true, id: post.id };
    }
  }

  async likePost(id: string) {

    const existing = await this.postRepository.findById(id);
    if (!existing) {
      throw new Error("Post not found");
    }

    await this.postRepository.incrementLikes(id);
    return { success: true };
  }

  async searchPosts(query: string, limit = 10) {
    const posts = await this.postRepository.search(query, limit);
    
    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || post.content.substring(0, 200) + "...",
      coverImage: post.coverImage,
      publishedAt: this.formatDate(post.publishedAt || post.createdAt),
    }));
  }

  private formatPostResponse(data: PostResponseData, includeFullContent = true) {
    const post = data.post;
    
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: includeFullContent ? post.content : post.content.substring(0, 300) + "...",
      excerpt: post.excerpt || post.content.substring(0, 200) + "...",
      coverImage: post.coverImage,
      author: {
        name: post.authorName || "Anonymous",
        username: post.authorUsername || "anonymous",
        avatar: post.authorAvatar,
        bio: post.authorBio,
        followers: post.authorFollowers || 0,
      },
      readTime: post.readTime || "5 min read",
      publishedAt: this.formatDate(post.publishedAt || post.createdAt),
      tags: data.categories || [],
      likes: post.likes || 0,
      comments: post.commentsCount || 0,
      views: post.views || 0,
      published: post.published || false,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private formatDate(date: Date | null): string {
    if (!date) return "Draft";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }
}