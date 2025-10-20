import { db } from "../db";
import { categories } from "../db/schema";
import { eq } from "drizzle-orm";

export class CategoryRepository {
  async findAll() {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async findById(id: string) {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  async findBySlug(slug: string) {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    
    return result[0] || null;
  }

  async create(data: { name: string; description?: string }) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const [category] = await db
      .insert(categories)
      .values({ ...data, slug })
      .returning();

    return category;
  }

  async update(id: string, data: { name?: string; description?: string }) {
    const updates: any = { ...data, updatedAt: new Date() };
    
    if (data.name) {
      updates.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const [category] = await db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();

    return category;
  }

  async delete(id: string) {
    await db.delete(categories).where(eq(categories.id, id));
  }
}