import { type NextFunction, type Request, type Response } from "express";

import { wishlistService } from "./service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";

class WishlistController {
  async getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const wishlist = await wishlistService.getWishlist(
        req.user!.userId,
      );

      return sendResponse(res, {
        message: "Wishlist fetched successfully.",
        data: wishlist,
      });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body;

      const wishlist = await wishlistService.addItem(
        req.user!.userId,
        productId,
      );

      return sendResponse(res, {
        statusCode: 201,
        message: "Product added to wishlist successfully.",
        data: wishlist,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const wishlist = await wishlistService.removeItem(
        req.user!.userId,
        req.params.productId as string,
      );

      return sendResponse(res, {
        message: "Product removed from wishlist successfully.",
        data: wishlist,
      });
    } catch (error) {
      next(error);
    }
  }

  async clearWishlist(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const wishlist = await wishlistService.clearWishlist(
        req.user!.userId,
      );

      return sendResponse(res, {
        message: "Wishlist cleared successfully.",
        data: wishlist,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const wishlistController = new WishlistController();