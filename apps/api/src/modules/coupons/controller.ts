import {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { couponService } from "./service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";

class CouponController {
  async validateCoupon(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { code, cartAmount } = req.body;

      const result = await couponService.validateCoupon(
        code,
        cartAmount,
      );

      return sendResponse(res, {
        message: "Coupon applied successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const couponController = new CouponController();