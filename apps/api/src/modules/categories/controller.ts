import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse.ts";
import { categoryService } from "./service.ts";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./validator.ts";

class CategoryController {
  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = createCategorySchema.parse(req.body);

      const category = await categoryService.createCategory(data);

      return sendResponse(res, {
        statusCode: 201,
        message: "Category created successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const categories = await categoryService.getCategories();

      return sendResponse(res, {
        statusCode: 200,
        message: "Categories fetched successfully.",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const category = await categoryService.getCategoryBySlug(
        req.params.slug as string,
      );

      return sendResponse(res, {
        statusCode: 200,
        message: "Category fetched successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = updateCategorySchema.parse(req.body);

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      );

      const category = await categoryService.updateCategory(
        req.params.categoryId as string,
        cleanData,
      );

      return sendResponse(res, {
        statusCode: 200,
        message: "Category updated successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await categoryService.deleteCategory(
        req.params.categoryId as string,
      );

      return sendResponse(res, {
        statusCode: 200,
        message: "Category deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();