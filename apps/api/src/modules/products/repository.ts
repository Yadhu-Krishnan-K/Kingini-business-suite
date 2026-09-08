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
      category,
      size,
      color,
      minPrice,
      maxPrice,
    } = filters;

    const where = {
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

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          category: true,
          images: true,
          variants: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.product.count({
        where,
      }),
    ]);

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