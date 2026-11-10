import { AppError } from "../../utils/AppError.ts";
import { cartRepository } from "./repository.ts";
import { prisma } from "@repo/database";

class CartService {
  async getCart(userId: string) {
    let cart = await cartRepository.findByUserId(userId);

    if (!cart) {
      cart = await cartRepository.create(userId);
    }

    return cart;
  }

  async addItem(
    userId: string,
    variantId: string,
    quantity: number,
  ) {
    if (quantity <= 0) {
      throw new AppError(400, "Quantity must be greater than 0.");
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new AppError(404, "Product variant not found.");
    }

    if (variant.stock < quantity) {
      throw new AppError(400, "Insufficient stock.");
    }

    let cart = await cartRepository.findByUserId(userId);

    if (!cart) {
      cart = await cartRepository.create(userId);
    }

    const existingItem = await cartRepository.findItem(
      cart.id,
      variantId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > variant.stock) {
        throw new AppError(400, "Insufficient stock.");
      }

      await cartRepository.updateItemQuantity(
        existingItem.id,
        newQuantity,
      );
    } else {
      await cartRepository.addItem(
        cart.id,
        variantId,
        quantity,
      );
    }

    return this.getCart(userId);
  }

  async updateItem(
    userId: string,
    variantId: string,
    quantity: number,
  ) {
    if (quantity <= 0) {
      throw new AppError(400, "Quantity must be greater than 0.");
    }

    const cart = await cartRepository.findByUserId(userId);

    if (!cart) {
      throw new AppError(404, "Cart not found.");
    }

    const item = await cartRepository.findItem(
      cart.id,
      variantId,
    );

    if (!item) {
      throw new AppError(404, "Cart item not found.");
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new AppError(404, "Product variant not found.");
    }

    if (quantity > variant.stock) {
      throw new AppError(400, "Insufficient stock.");
    }

    await cartRepository.updateItemQuantity(
      item.id,
      quantity,
    );

    return this.getCart(userId);
  }

  async removeItem(
    userId: string,
    variantId: string,
  ) {
    const cart = await cartRepository.findByUserId(userId);

    if (!cart) {
      throw new AppError(404, "Cart not found.");
    }

    const item = await cartRepository.findItem(
      cart.id,
      variantId,
    );

    if (!item) {
      throw new AppError(404, "Cart item not found.");
    }

    await cartRepository.deleteItem(item.id);

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await cartRepository.findByUserId(userId);

    if (!cart) {
      return this.getCart(userId);
    }

    await cartRepository.clearItems(cart.id);

    return this.getCart(userId);
  }
}

export const cartService = new CartService();