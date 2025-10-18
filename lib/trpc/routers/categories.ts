import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
} from "@/lib/db/queries";

export const categoriesRouter = router({
  getAll: publicProcedure.query(async () => {
    return await getAllCategories();
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await getCategoryBySlug(input.slug);
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await createCategory(input);
    }),
});