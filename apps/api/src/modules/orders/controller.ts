import {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { orderService } from "./service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";

import { orderHistoryQuerySchema } from "./dto.ts";

class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.createOrder(
        req.user!.userId,
        req.body,
      );

      return sendResponse(res, {
        statusCode: 201,
        message: "Order created successfully.",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const query = orderHistoryQuerySchema.parse(req.query);

      const result = await orderService.getOrderHistory(
        req.user!.userId,
        query,
      );

      return sendResponse(res, {
        message: "Orders retrieved successfully.",
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const order = await orderService.getOrderDetails(
        req.params.orderId as string,
        req.user!.userId,
      );

      return sendResponse(res, {
        message: "Order details retrieved successfully.",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();