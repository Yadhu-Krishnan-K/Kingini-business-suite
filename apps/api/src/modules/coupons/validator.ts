import { z } from "zod";

export const validateCouponSchema = z.object({
  code: z.string().trim().min(1),
  cartAmount: z.number().nonnegative(),
});