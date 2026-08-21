import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.ts";
import { sendResponse } from "../../utils/sendResponse.ts";
import { productService } from "./service.ts";

class ProductController {
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