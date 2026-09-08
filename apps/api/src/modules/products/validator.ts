import { z } from "zod";

export const createProductSchema = z.object({
  categoryId: z.uuid("Invalid category id."),
  name: z.string().trim().min(3).max(120),
  slug: z.string().trim().min(3).max(150).regex(/^[a-z0-9-]+$/, {
    message: "Slug must contain lowercase letters, numbers and hyphens only.",
  }),
  description: z.string().trim().min(10).max(5000),
  brand: z.string().trim().min(2).max(80).optional(),
  isPublished: z.boolean().optional(),
});

export const createProductVariantSchema = z.object({
  size: z.string().trim().min(1).max(20),
  color: z.string().trim().min(1).max(50),
  sku: z.string().trim().min(1).max(100),
  price: z.string().trim().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Price must be a valid monetary amount.",
  }),
  stock: z.number().int().min(0),
});

export const productPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  category: z.string().trim().min(1).optional(),
  size: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
});

export const updateProductVariantSchema =
  createProductVariantSchema.partial();

export const updateVariantStockSchema = z.object({
  stock: z.number().int().min(0),
});

export const decrementVariantStockSchema = z.object({
  quantity: z.number().int().min(1),
});

export type DecrementVariantStockDto = z.infer<
  typeof decrementVariantStockSchema
>;

export type CreateProductVariantSchema = z.infer<
  typeof createProductVariantSchema
>;

export type UpdateProductVariantSchema = z.infer<
  typeof updateProductVariantSchema
>;

export const updateProductSchema = createProductSchema.partial();

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;