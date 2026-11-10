import { z } from "zod";

export const createRazorpayOrderSchema = z.object({
  orderId: z.string().uuid(),
});

export type CreateRazorpayOrderDto = z.infer<
  typeof createRazorpayOrderSchema
>;

export const verifyRazorpayPaymentSchema = z.object({
  orderId: z.string().uuid(),
  razorpayPaymentId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type VerifyRazorpayPaymentDto = z.infer<
  typeof verifyRazorpayPaymentSchema
>;

export const cancelRazorpayPaymentSchema = z.object({
  orderId: z.string().uuid(),
});

export type CancelRazorpayPaymentDto = z.infer<
  typeof cancelRazorpayPaymentSchema
>;