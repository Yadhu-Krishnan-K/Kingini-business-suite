import { AppError } from "../../utils/AppError.ts";
import { uploadImage } from "../../utils/cloudinary.ts";
import { productRepository } from "./repository.ts";
import {
  toProductImageResponse,
  toProductResponse,
  toProductVariantResponse,
} from "./mapper.ts";
import type {
  CreateProductDto,
  CreateProductVariantDto,
  ProductImageResponseDto,
  ProductResponseDto,
  ProductVariantResponseDto,
  UpdateProductDto,
  UpdateProductVariantDto,
} from "./dto.ts";

import type { ProductFilters } from "./types.ts"


class ProductService {
  async createProduct(
    data: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const category = await this.categoryExists(data.categoryId);

    if (!category) {
      throw new AppError(404, "Category not found.");
    }

    const existingProduct = await productRepository.findBySlug(data.slug);

    if (existingProduct) {
      throw new AppError(409, "Product with this slug already exists.");
    }

    const product = await productRepository.create(data);

    return toProductResponse(product);
  }

  async getProducts(page: number, limit: number, filters: ProductFilters): Promise<{
    products: ProductResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;
    const { products, total } = await productRepository.findAll(skip, limit, filters);
    return {
      products: products.map(toProductResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductBySlug(
    slug: string,
  ): Promise<ProductResponseDto> {
    const product = await productRepository.findBySlug(slug);

    if (!product) {
      throw new AppError(404, "Product not found.");
    }

    return toProductResponse(product);
  }

  async updateProduct(
    productId: string,
    data: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const existingProduct = await productRepository.findById(productId);

    if (!existingProduct) {
      throw new AppError(404, "Product not found.");
    }

    if (data.categoryId) {
      const category = await this.categoryExists(data.categoryId);

      if (!category) {
        throw new AppError(404, "Category not found.");
      }
    }

    if (data.slug && data.slug !== existingProduct.slug) {
      const productWithSlug = await productRepository.findBySlug(data.slug);

      if (productWithSlug && productWithSlug.id !== productId) {
        throw new AppError(409, "Product with this slug already exists.");
      }
    }

    const product = await productRepository.update(productId, data);

    return toProductResponse(product);
  }

  async createVariant(
    productId: string,
    data: CreateProductVariantDto,
  ): Promise<ProductVariantResponseDto> {
    const product = await productRepository.findById(productId);

    if (!product) {
      throw new AppError(404, "Product not found.");
    }

    const existingVariant = await productRepository.findVariantBySku(
      data.sku,
    );

    if (existingVariant) {
      throw new AppError(409, "Variant with this SKU already exists.");
    }

    const variant = await productRepository.createVariant(
      productId,
      data,
    );

    return toProductVariantResponse(variant);
  }

  async updateVariant(
    productId: string,
    variantId: string,
    data: UpdateProductVariantDto,
  ): Promise<ProductVariantResponseDto> {
    const variant = await productRepository.findVariantById(variantId);

    if (!variant || variant.productId !== productId) {
      throw new AppError(404, "Product variant not found.");
    }

    if (data.sku && data.sku !== variant.sku) {
      const existingVariant = await productRepository.findVariantBySku(
        data.sku,
      );

      if (existingVariant && existingVariant.id !== variantId) {
        throw new AppError(409, "Variant with this SKU already exists.");
      }
    }

    const updatedVariant = await productRepository.updateVariant(
      variantId,
      data,
    );

    return toProductVariantResponse(updatedVariant);
  }
  async updateVariantStock(
    productId: string,
    variantId: string,
    stock: number,
  ): Promise<ProductVariantResponseDto> {
    const variant = await productRepository.findVariantById(variantId);

    if (!variant || variant.productId !== productId) {
      throw new AppError(404, "Product variant not found.");
    }

    const updatedVariant = await productRepository.updateVariantStock(
      variantId,
      stock,
    );

    return toProductVariantResponse(updatedVariant);
  }

  async decrementVariantStock(
  productId: string,
  variantId: string,
  quantity: number,
): Promise<ProductVariantResponseDto> {
  const variant = await productRepository.findVariantById(variantId);

  if (!variant || variant.productId !== productId) {
    throw new AppError(404, "Product variant not found.");
  }

  const updatedCount = await productRepository.decrementVariantStock(
    variantId,
    quantity,
  );

  if (updatedCount === 0) {
    throw new AppError(409, "Insufficient stock.");
  }

  const updatedVariant = await productRepository.findVariantById(variantId);

  if (!updatedVariant) {
    throw new AppError(404, "Product variant not found.");
  }

  return toProductVariantResponse(updatedVariant);
}

  async deleteVariant(
    productId: string,
    variantId: string,
  ): Promise<void> {
    const variant = await productRepository.findVariantById(variantId);

    if (!variant || variant.productId !== productId) {
      throw new AppError(404, "Product variant not found.");
    }

    await productRepository.deleteVariant(variantId);
  }

  async deleteProduct(productId: string): Promise<void> {
    const product = await productRepository.findById(productId);

    if (!product) {
      throw new AppError(404, "Product not found.");
    }

    await productRepository.delete(productId);
  }

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

  private async categoryExists(categoryId: string) {
    return productRepository.findCategoryById(categoryId);
  }
}

export const productService = new ProductService();