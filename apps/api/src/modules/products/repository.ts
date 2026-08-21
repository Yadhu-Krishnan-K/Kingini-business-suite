import { prisma } from "@repo/database";

class ProductRepository {
  async findById(id: string) {
    return prisma.product.findUnique({
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
}

export const productRepository = new ProductRepository();