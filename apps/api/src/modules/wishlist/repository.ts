import { prisma } from "@repo/database";

class WishlistRepository {
  async findByUserId(userId: string) {
    return prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                variants: true,
              },
            },
          },
        },
      },
    });
  }

  async create(userId: string) {
    return prisma.wishlist.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                variants: true,
              },
            },
          },
        },
      },
    });
  }

  async findItem(wishlistId: string, productId: string) {
    return prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId,
          productId,
        },
      },
    });
  }

  async addItem(wishlistId: string, productId: string) {
    return prisma.wishlistItem.create({
      data: {
        wishlistId,
        productId,
      },
    });
  }

  async deleteItem(itemId: string) {
    return prisma.wishlistItem.delete({
      where: { id: itemId },
    });
  }

  async clearItems(wishlistId: string) {
    return prisma.wishlistItem.deleteMany({
      where: { wishlistId },
    });
  }
}

export const wishlistRepository = new WishlistRepository();