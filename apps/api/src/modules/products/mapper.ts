import type {
  Category,
  Product,
  ProductImage,
  ProductVariant,
} from "@repo/database";

import type {
  CategoryResponseDto,
  ProductResponseDto,
  ProductVariantResponseDto,
  ProductImageResponseDto
} from "./dto.ts";


export function toProductImageResponse(
  image: ProductImage,
): ProductImageResponseDto {
  return {
    id: image.id,
    productId: image.productId,
    imageUrl: image.imageUrl,
    publicId: image.publicId,
    createdAt: image.createdAt,
  };
}

export function toCategoryResponse(
  category: Category,
): CategoryResponseDto {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

export function toProductVariantResponse(
  variant: ProductVariant,
): ProductVariantResponseDto {
  return {
    id: variant.id,
    productId: variant.productId,
    size: variant.size,
    color: variant.color,
    sku: variant.sku,
    price: variant.price.toString(),
    stock: variant.stock,
    createdAt: variant.createdAt,
    updatedAt: variant.updatedAt,
  };
}

type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
};

export function toProductResponse(
  product: ProductWithRelations,
): ProductResponseDto {
  return {
    id: product.id,
    categoryId: product.categoryId,
    name: product.name,
    slug: product.slug,
    description: product.description,
    brand: product.brand,
    isPublished: product.isPublished,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    category: toCategoryResponse(product.category),
    images: product.images.map(toProductImageResponse),
    variants: product.variants.map(toProductVariantResponse),
  };
}