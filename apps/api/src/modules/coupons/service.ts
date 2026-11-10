import { AppError } from "../../utils/AppError.ts";
import { couponRepository } from "./repository.ts";

class CouponService {
  async validateCoupon(code: string, cartAmount: number) {
    const coupon = await couponRepository.findByCode(code);

    if (!coupon) {
      throw new AppError(404, "Invalid coupon code.");
    }

    if (
      coupon.expiresAt &&
      coupon.expiresAt.getTime() < Date.now()
    ) {
      throw new AppError(400, "Coupon has expired.");
    }

    if (
      coupon.minimumAmount !== null &&
      cartAmount < Number(coupon.minimumAmount)
    ) {
      throw new AppError(
        400,
        `Minimum order amount is ₹${Number(coupon.minimumAmount).toFixed(2)}.`,
      );
    }

    if (coupon.discount <= 0 || coupon.discount > 100) {
      throw new AppError(400, "Invalid coupon discount.");
    }

    const discountAmount =
      (cartAmount * coupon.discount) / 100;

    const total = cartAmount - discountAmount;

    return {
      code: coupon.code,
      discount: coupon.discount,
      discountAmount,
      total,
    };
  }
}

export const couponService = new CouponService();