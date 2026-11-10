export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}
export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  publicId: string;
  createdAt: string;
}
export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  sku: string;
  price: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory;
  images: ProductImage[];
  variants: ProductVariant[];
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: Pagination;
}