import { prisma } from "@repo/database";

class CartRepository {
  async findByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async create(userId: string) {
    return prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async findItem(cartId: string, variantId: string) {
    return prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId,
          variantId,
        },
      },
    });
  }

  async addItem(
    cartId: string,
    variantId: string,
    quantity: number,
  ) {
    return prisma.cartItem.create({
      data: {
        cartId,
        variantId,
        quantity,
      },
    });
  }

  async updateItemQuantity(
    itemId: string,
    quantity: number,
  ) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async deleteItem(itemId: string) {
    return prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearItems(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}

export const cartRepository = new CartRepository();