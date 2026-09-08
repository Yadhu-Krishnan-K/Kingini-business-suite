export interface ProductImageResponseDto {
  id: string;
  productId: string;
  imageUrl: string;
  publicId: string;
  createdAt: Date;
}

export interface CreateProductDto {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  brand?: string;
  isPublished?: boolean;
}

export interface UpdateProductDto {
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string;
  brand?: string;
  isPublished?: boolean;
}

export interface CreateProductVariantDto {
  size: string;
  color: string;
  sku: string;
  price: string;
  stock: number;
}

export interface UpdateProductVariantDto {
  size?: string;
  color?: string;
  sku?: string;
  price?: string;
  stock?: number;
}

export interface ProductVariantResponseDto {
  id: string;
  productId: string;
  size: string;
  color: string;
  sku: string;
  price: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
}

export interface ProductResponseDto {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: CategoryResponseDto;
  images: ProductImageResponseDto[];
  variants: ProductVariantResponseDto[];
}

export interface UpdateVariantStockDto {
  stock: number;
}