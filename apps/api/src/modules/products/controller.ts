import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.ts";
import { sendResponse } from "../../utils/sendResponse.ts";
import { productService } from "./service.ts";
import type {
  CreateProductDto,
  UpdateProductDto,
} from "./dto.ts";

import {
  createProductSchema,
  createProductVariantSchema,
  updateProductSchema,
  updateProductVariantSchema,
  productPaginationSchema,
  updateVariantStockSchema,
  decrementVariantStockSchema
} from "./validator.ts";

class ProductController {
  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = createProductSchema.parse(req.body);

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      );

      const product = await productService.createProduct(cleanData);

      return sendResponse(res, {
        statusCode: 201,
        message: "Product created successfully.",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        category,
        size,
        color,
        minPrice,
        maxPrice,
      } = productPaginationSchema.parse(req.query);

      const { products, pagination } = await productService.getProducts(
        page,
        limit,
        {
          search,
          sortBy,
          sortOrder,
          category,
          size,
          color,
          minPrice,
          maxPrice,
        }
      );

      return sendResponse(res, {
        statusCode: 200,
        message: "Products fetched successfully.",
        data: products,
        pagination,
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
      const product = await productService.getProductBySlug(
        req.params.slug as string,
      );

      return sendResponse(res, {
        statusCode: 200,
        message: "Product fetched successfully.",
        data: product,
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
      const data = updateProductSchema.parse(req.body);

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      );

      const product = await productService.updateProduct(
        req.params.productId as string,
        cleanData,
      );

      return sendResponse(res, {
        statusCode: 200,
        message: "Product updated successfully.",
        data: product,
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
      await productService.deleteProduct(
        req.params.productId as string,
      );

      return sendResponse(res, {
        statusCode: 200,
        message: "Product deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  async createVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = createProductVariantSchema.parse(req.body);

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      );

      const variant = await productService.createVariant(
        req.params.productId as string,
        cleanData,
      );

      return sendResponse(res, {
        statusCode: 201,
        message: "Product variant created successfully.",
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = updateProductVariantSchema.parse(req.body);

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      );

      const variant = await productService.updateVariant(
        req.params.productId as string,
        req.params.variantId as string,
        cleanData,
      );

      return sendResponse(res, {
        statusCode: 200,
        message: "Product variant updated successfully.",
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVariantStock(req: Request, res: Response) {
    const { productId, variantId } = req.params;

    const { stock } = updateVariantStockSchema.parse(req.body);

    const variant = await productService.updateVariantStock(
      productId as string,
      variantId as string,
      stock,
    );

    return sendResponse(res, {
      statusCode: 200,
      message: "Variant stock updated successfully.",
      data: variant,
    });
  }

  async decrementVariantStock(req: Request, res: Response) {
    const { productId, variantId } = req.params;

    const { quantity } = decrementVariantStockSchema.parse(req.body);

    const variant = await productService.decrementVariantStock(
      productId as string,
      variantId as string,
      quantity,
    );

    return sendResponse(res, {
      statusCode: 200,
      message: "Variant stock decreased successfully.",
      data: variant,
    });
  }

  async deleteVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await productService.deleteVariant(
        req.params.productId as string,
        req.params.variantId as string,
      );

      return sendResponse(res, {
        statusCode: 200,
        message: "Product variant deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadImage(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.file) {
        throw new AppError(400, "Image file is required.");
      }

      const image = await productService.uploadProductImage(
        req.params.productId as string,
        req.file,
      );

      return sendResponse(res, {
        statusCode: 201,
        message: "Product image uploaded successfully.",
        data: image,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();