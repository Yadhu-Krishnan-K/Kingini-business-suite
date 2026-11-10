import { type NextFunction, type Request, type Response } from "express";

import { cartService } from "./service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";

class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.getCart(req.user!.userId);

      return sendResponse(res, {
        message: "Cart fetched successfully.",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { variantId, quantity } = req.body;

      const cart = await cartService.addItem(
        req.user!.userId,
        variantId,
        quantity,
      );

      return sendResponse(res, {
        statusCode: 201,
        message: "Item added to cart successfully.",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { variantId, quantity } = req.body;

      const cart = await cartService.updateItem(
        req.user!.userId,
        variantId,
        quantity,
      );

      return sendResponse(res, {
        message: "Cart item updated successfully.",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.removeItem(
        req.user!.userId,
        req.params.variantId as string,
      );

      return sendResponse(res, {
        message: "Cart item removed successfully.",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.clearCart(req.user!.userId);

      return sendResponse(res, {
        message: "Cart cleared successfully.",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();