import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
} from "@/lib/db/queries";
import { db } from "@/drizzle/db";
import { categories } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

// Input validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().optional(),
});

const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});

export const categoriesRouter = router({
  // Get all categories
  getAll: publicProcedure.query(async () => {
    try {
      const allCategories = await getAllCategories();
      return allCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        postsCount: cat.postsCount || 0,
        createdAt: cat.createdAt,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }),

  // Get single category by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const category = await getCategoryBySlug(input.slug);
        if (!category) {
          throw new Error("Category not found");
        }
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          postsCount: category.postsCount || 0,
        };
      } catch (error) {
        console.error("Error fetching category:", error);
        throw new Error("Failed to fetch category");
      }
    }),

  // Get category by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const [category] = await db
          .select()
          .from(categories)
          .where(eq(categories.id, input.id))
          .limit(1);

        if (!category) {
          throw new Error("Category not found");
        }

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          postsCount: category.postsCount || 0,
        };
      } catch (error) {
        console.error("Error fetching category:", error);
        throw new Error("Failed to fetch category");
      }
    }),

  // Create new category
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      try {
        const category = await createCategory(input);
        return {
          success: true,
          category: {
            id: category.id,
            slug: category.slug,
          },
        };
      } catch (error) {
        console.error("Error creating category:", error);
        throw new Error("Failed to create category");
      }
    }),

  // Update existing category
  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        
        // Generate new slug if name changed
        const updateData: any = { ...data };
        if (data.name) {
          updateData.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        }
        updateData.updatedAt = new Date();

        const [updated] = await db
          .update(categories)
          .set(updateData)
          .where(eq(categories.id, id))
          .returning();

        if (!updated) {
          throw new Error("Category not found");
        }

        return {
          success: true,
          category: {
            id: updated.id,
            slug: updated.slug,
          },
        };
      } catch (error) {
        console.error("Error updating category:", error);
        throw new Error("Failed to update category");
      }
    }),

  // Delete category
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await db.delete(categories).where(eq(categories.id, input.id));
        return { success: true };
      } catch (error) {
        console.error("Error deleting category:", error);
        throw new Error("Failed to delete category");
      }
    }),

  // Get popular categories (by post count)
  getPopular: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }))
    .query(async ({ input }) => {
      try {
        const allCategories = await getAllCategories();
        return allCategories
          .sort((a, b) => (b.postsCount || 0) - (a.postsCount || 0))
          .slice(0, input.limit)
          .map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            postsCount: cat.postsCount || 0,
          }));
      } catch (error) {
        console.error("Error fetching popular categories:", error);
        throw new Error("Failed to fetch popular categories");
      }
    }),
});