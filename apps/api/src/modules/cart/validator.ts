import { z } from "zod";

export const addCartItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const updateCartItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive(),
});