import type { ProductImage } from "@repo/database";
import type { ProductImageResponseDto } from "./dto.ts";

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
