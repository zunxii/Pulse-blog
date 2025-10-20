import { pgTable, uuid, varchar, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  postsCount: integer("posts_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  published: boolean("published").default(false),
  
  authorName: varchar("author_name", { length: 100 }).default("Anonymous"),
  authorUsername: varchar("author_username", { length: 100 }).default("anonymous"),
  authorAvatar: text("author_avatar"),
  
  readTime: varchar("read_time", { length: 20 }),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  commentsCount: integer("comments_count").default(0),
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

export const postCategories = pgTable("post_categories", {
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
});

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id"),
  authorName: varchar("author_name", { length: 100 }).notNull(),
  authorUsername: varchar("author_username", { length: 100 }).notNull(),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Relations
export const postsRelations = relations(posts, ({ many }) => ({
  postCategories: many(postCategories),
  comments: many(comments),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}));

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postCategories.categoryId],
    references: [categories.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));

// Types
export type Category = typeof categories.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
