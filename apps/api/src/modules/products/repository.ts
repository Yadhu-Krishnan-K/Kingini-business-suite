import { prisma, Prisma } from "@repo/database";
import type { ProductFilters } from "./types.ts";

class ProductRepository {
  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async findCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  async findAll(skip: number, take: number, filters: ProductFilters) {
    const {
      search,
      sortBy,
      sortOrder,
      category,
      size,
      color,
      minPrice,
      maxPrice,
    } = filters;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
        ],
      }),

      ...(category && {
        category: {
          slug: category,
        },
      }),

      ...(size || color || minPrice !== undefined || maxPrice !== undefined
        ? {
          variants: {
            some: {
              ...(size && { size }),
              ...(color && { color }),
              ...(minPrice !== undefined || maxPrice !== undefined
                ? {
                  price: {
                    ...(minPrice !== undefined && { gte: minPrice }),
                    ...(maxPrice !== undefined && { lte: maxPrice }),
                  },
                }
                : {}),
            },
          },
        }
        : {}),
    };

    const allProducts = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    const direction = sortOrder === "asc" ? 1 : -1;

    if (sortBy === "price") {
      allProducts.sort((a, b) => {
        const aPrice =
          a.variants.length > 0
            ? Math.min(...a.variants.map((variant) => Number(variant.price)))
            : Infinity;

        const bPrice =
          b.variants.length > 0
            ? Math.min(...b.variants.map((variant) => Number(variant.price)))
            : Infinity;

        return (aPrice - bPrice) * direction;
      });
    } else {
      allProducts.sort((a, b) => {
        return (
          (new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()) *
          direction
        );
      });
    }

    const total = allProducts.length;
    const products = allProducts.slice(skip, skip + take);

    return {
      products,
      total,
    };
  }

  async create(data: {
    categoryId: string;
    name: string;
    slug: string;
    description: string;
    brand?: string;
    isPublished?: boolean;
  }) {
    return prisma.product.create({
      data,
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      categoryId?: string;
      name?: string;
      slug?: string;
      description?: string;
      brand?: string;
      isPublished?: boolean;
    },
  ) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }

  async createImage(
    productId: string,
    imageUrl: string,
    publicId: string,
  ) {
    return prisma.productImage.create({
      data: {
        productId,
        imageUrl,
        publicId,
      },
    });
  }

  async findVariantBySku(sku: string) {
    return prisma.productVariant.findUnique({
      where: { sku },
    });
  }

  async findVariantById(id: string) {
    return prisma.productVariant.findUnique({
      where: { id },
    });
  }

  async createVariant(
    productId: string,
    data: {
      size: string;
      color: string;
      sku: string;
      price: string;
      stock: number;
    },
  ) {
    return prisma.productVariant.create({
      data: {
        productId,
        size: data.size,
        color: data.color,
        sku: data.sku,
        price: data.price,
        stock: data.stock,
      },
    });
  }

  async updateVariant(
    id: string,
    data: {
      size?: string;
      color?: string;
      sku?: string;
      price?: string;
      stock?: number;
    },
  ) {
    return prisma.productVariant.update({
      where: { id },
      data,
    });
  }

  async updateVariantStock(id: string, stock: number) {
    return prisma.productVariant.update({
      where: { id },
      data: { stock },
    });
  }

  async decrementVariantStock(id: string, quantity: number) {
    const result = await prisma.productVariant.updateMany({
      where: {
        id,
        stock: {
          gte: quantity,
        },
      },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    return result.count;
  }

  async deleteVariant(id: string) {
    return prisma.productVariant.delete({
      where: { id },
    });
  }

}

export const productRepository = new ProductRepository();