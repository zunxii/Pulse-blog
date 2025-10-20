import { CategoryRepository } from "../repositories/category.repository";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getAllCategories() {
    const categories = await this.categoryRepository.findAll();
    
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      postsCount: cat.postsCount || 0,
      createdAt: cat.createdAt,
    }));
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findById(id);
    
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
  }

  async createCategory(data: { name: string; description?: string }) {
    const category = await this.categoryRepository.create(data);
    
    return {
      success: true,
      category: {
        id: category.id,
        slug: category.slug,
      },
    };
  }

  async updateCategory(id: string, data: { name?: string; description?: string }) {
    const category = await this.categoryRepository.update(id, data);
    
    if (!category) {
      throw new Error("Category not found");
    }

    return {
      success: true,
      category: {
        id: category.id,
        slug: category.slug,
      },
    };
  }

  async deleteCategory(id: string) {
    await this.categoryRepository.delete(id);
    return { success: true };
  }
}