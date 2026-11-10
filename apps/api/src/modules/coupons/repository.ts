import { prisma } from "@repo/database";

class CouponRepository {
  async findByCode(code: string) {
    return prisma.coupon.findUnique({
      where: {
        code,
      },
    });
  }
}

export const couponRepository = new CouponRepository();