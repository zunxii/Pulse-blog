import { CategoryService } from "@/server/services/category.service";
import { router, publicProcedure } from "../index";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const categoryService = new CategoryService();

export const categoryRouter = router({
  getAll: publicProcedure
    .query(async () => {
      try {
        return await categoryService.getAllCategories();
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch categories',
          cause: error,
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        return await categoryService.getCategoryById(input.id);
      } catch (error) {
        if (error instanceof Error && error.message === 'Category not found') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch category',
          cause: error,
        });
      }
    }),
  
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1, "Name is required").max(100, "Name too long"),
      description: z.string().max(500, "Description too long").optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await categoryService.createCategory(input);
      } catch (error) {
        if (error instanceof Error && error.message.includes('already exists')) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: error.message,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create category',
          cause: error,
        });
      }
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1).max(100).optional(),
      description: z.string().max(500).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        return await categoryService.updateCategory(id, data);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Category not found') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Category not found',
            });
          }
          if (error.message.includes('already exists')) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: error.message,
            });
          }
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update category',
          cause: error,
        });
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        return await categoryService.deleteCategory(input.id);
      } catch (error) {
        if (error instanceof Error && error.message === 'Category not found') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete category',
          cause: error,
        });
      }
    }),
});