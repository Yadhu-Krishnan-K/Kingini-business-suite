import { AppError } from "../../utils/AppError.ts";
import { uploadImage } from "../../utils/cloudinary.ts";
import { productRepository } from "./repository.ts";
import { toProductImageResponse } from "./mapper.ts";
import type { ProductImageResponseDto } from "./dto.ts";

class ProductService {
  async uploadProductImage(
    productId: string,
    file: Express.Multer.File,
  ): Promise<ProductImageResponseDto> {
    const product = await productRepository.findById(productId);

    if (!product) {
      throw new AppError(404, "Product not found.");
    }

    const folder = `kingini/products/${productId}`;

    const result = await uploadImage(file.buffer, folder);

    const image = await productRepository.createImage(
      productId,
      result.secure_url,
      result.public_id,
    );

    return toProductImageResponse(image);
  }
}

export const productService = new ProductService();