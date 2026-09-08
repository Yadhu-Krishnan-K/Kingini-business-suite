import { AppError } from "../../utils/AppError.ts";
import { categoryRepository } from "./repository.ts";
import { toCategoryResponse } from "./mapper.ts";
import type {
  CreateCategoryDto,
  CategoryResponseDto,
  UpdateCategoryDto,
} from "./dto.ts";

class CategoryService {
  async createCategory(
    data: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const existingCategory = await categoryRepository.findBySlug(data.slug);

    if (existingCategory) {
      throw new AppError(409, "Category with this slug already exists.");
    }

    const category = await categoryRepository.create(data);

    return toCategoryResponse(category);
  }

  async getCategories(): Promise<CategoryResponseDto[]> {
    const categories = await categoryRepository.findAll();

    return categories.map(toCategoryResponse);
  }

  async getCategoryBySlug(
    slug: string,
  ): Promise<CategoryResponseDto> {
    const category = await categoryRepository.findBySlug(slug);

    if (!category) {
      throw new AppError(404, "Category not found.");
    }

    return toCategoryResponse(category);
  }

  async updateCategory(
    categoryId: string,
    data: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const existingCategory = await categoryRepository.findById(categoryId);

    if (!existingCategory) {
      throw new AppError(404, "Category not found.");
    }

    if (data.slug && data.slug !== existingCategory.slug) {
      const categoryWithSlug = await categoryRepository.findBySlug(data.slug);

      if (
        categoryWithSlug &&
        categoryWithSlug.id !== categoryId
      ) {
        throw new AppError(409, "Category with this slug already exists.");
      }
    }

    const category = await categoryRepository.update(
      categoryId,
      data,
    );

    return toCategoryResponse(category);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError(404, "Category not found.");
    }

    await categoryRepository.delete(categoryId);
  }
}

export const categoryService = new CategoryService();