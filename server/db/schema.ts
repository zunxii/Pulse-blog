import { pgTable, uuid, varchar, text, boolean, integer, timestamp, index, unique, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  postsCount: integer("posts_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  slugIdx: index("categories_slug_idx").on(table.slug),
  nameIdx: index("categories_name_idx").on(table.name),
}));

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
  authorBio: text("author_bio"),
  authorFollowers: integer("author_followers").default(0),

  readTime: varchar("read_time", { length: 20 }),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  commentsCount: integer("comments_count").default(0),
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("posts_slug_idx").on(table.slug),
  publishedIdx: index("posts_published_idx").on(table.published),
  publishedAtIdx: index("posts_published_at_idx").on(table.publishedAt),
  createdAtIdx: index("posts_created_at_idx").on(table.createdAt),
  authorUsernameIdx: index("posts_author_username_idx").on(table.authorUsername),

  publishedCreatedIdx: index("posts_published_created_idx").on(table.published, table.createdAt),
}));

export const postCategories = pgTable("post_categories", {
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.categoryId] }),
  postIdx: index("post_categories_post_idx").on(table.postId),
  categoryIdx: index("post_categories_category_idx").on(table.categoryId),
}));

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id"),
  authorName: varchar("author_name", { length: 100 }).notNull(),
  authorUsername: varchar("author_username", { length: 100 }).notNull(),
  authorAvatar: text("author_avatar"),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  postIdx: index("comments_post_idx").on(table.postId),
  parentIdx: index("comments_parent_idx").on(table.parentId),
  createdAtIdx: index("comments_created_at_idx").on(table.createdAt),
}));

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}));

export const postsRelations = relations(posts, ({ many }) => ({
  postCategories: many(postCategories),
  comments: many(comments),
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
export type NewCategory = typeof categories.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;