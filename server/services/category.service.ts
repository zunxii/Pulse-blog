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
    // Check if category with same name exists
    const existing = await this.categoryRepository.findAll();
    const duplicate = existing.find(
      cat => cat.name.toLowerCase() === data.name.toLowerCase()
    );
    
    if (duplicate) {
      throw new Error("Category with this name already exists");
    }

    const category = await this.categoryRepository.create(data);
    
    return {
      success: true,
      category: {
        id: category.id,
        slug: category.slug,
        name: category.name,
      },
    };
  }

  async updateCategory(id: string, data: { name?: string; description?: string }) {
    // Check if category exists
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new Error("Category not found");
    }

    // If updating name, check for duplicates
    if (data.name) {
      const allCategories = await this.categoryRepository.findAll();
      const duplicate = allCategories.find(
        cat => cat.id !== id && cat.name.toLowerCase() === data.name!.toLowerCase()
      );
      
      if (duplicate) {
        throw new Error("Category with this name already exists");
      }
    }

    const category = await this.categoryRepository.update(id, data);

    return {
      success: true,
      category: {
        id: category.id,
        slug: category.slug,
        name: category.name,
      },
    };
  }

  async deleteCategory(id: string) {
    // Check if category exists
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new Error("Category not found");
    }

    await this.categoryRepository.delete(id);
    return { success: true };
  }
}