import { CategoryService } from "@/server/services/category.service";
import { router, publicProcedure } from "../index";
import z from "zod";

const categoryService = new CategoryService();

export const categoryRouter = router({
    getAll : publicProcedure.query(async () => {
      return await categoryService.getAllCategories();
    }
    ),
    getById : publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await categoryService.getCategoryById(input.id);
    }),
    
    create : publicProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
    }))
    .mutation(async ({ input }) => {
      return await categoryService.createCategory(input);
    }),
    update : publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(100).optional(),
      description: z.string().max(500).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await categoryService.updateCategory(id, data);
    }),
    delete : publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await categoryService.deleteCategory(input.id);
    }),
})