import { z } from "zod";

export const createOrderSchema = z.object({
    addressId: z.string().uuid(),
    couponCode: z.string().trim().min(1).optional(),
});

export const orderHistoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});


export type OrderHistoryQuery = z.infer<
  typeof orderHistoryQuerySchema
>;
export type CreateOrderDto = z.infer<typeof createOrderSchema>;