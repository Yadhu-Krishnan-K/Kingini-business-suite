import { apiFetch } from "@/lib/api";
import type { Product, ProductsResponse } from "@/types/product";

export async function getProducts(): Promise<ProductsResponse> {
  return apiFetch<ProductsResponse>("/products");
}

export async function getProductBySlug(slug: string): Promise<{
  success: boolean;
  message: string;
  data: Product;
}> {
  return apiFetch(`/products/${slug}`);
}