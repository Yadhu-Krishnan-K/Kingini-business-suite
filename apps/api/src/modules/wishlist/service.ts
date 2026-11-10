import { prisma } from "@repo/database";
import { AppError } from "../../utils/AppError.ts";
import { wishlistRepository } from "./repository.ts";

class WishlistService {
  async getWishlist(userId: string) {
    let wishlist = await wishlistRepository.findByUserId(userId);

    if (!wishlist) {
      wishlist = await wishlistRepository.create(userId);
    }

    return wishlist;
  }

  async addItem(userId: string, productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError(404, "Product not found.");
    }

    if (!product.isPublished) {
      throw new AppError(400, "Product is not available.");
    }

    let wishlist = await wishlistRepository.findByUserId(userId);

    if (!wishlist) {
      wishlist = await wishlistRepository.create(userId);
    }

    const existingItem = await wishlistRepository.findItem(
      wishlist.id,
      productId,
    );

    if (existingItem) {
      throw new AppError(409, "Product is already in wishlist.");
    }

    await wishlistRepository.addItem(
      wishlist.id,
      productId,
    );

    return this.getWishlist(userId);
  }

  async removeItem(userId: string, productId: string) {
    const wishlist = await wishlistRepository.findByUserId(userId);

    if (!wishlist) {
      throw new AppError(404, "Wishlist not found.");
    }

    const item = await wishlistRepository.findItem(
      wishlist.id,
      productId,
    );

    if (!item) {
      throw new AppError(404, "Wishlist item not found.");
    }

    await wishlistRepository.deleteItem(item.id);

    return this.getWishlist(userId);
  }

  async clearWishlist(userId: string) {
    const wishlist = await wishlistRepository.findByUserId(userId);

    if (!wishlist) {
      return this.getWishlist(userId);
    }

    await wishlistRepository.clearItems(wishlist.id);

    return this.getWishlist(userId);
  }
}

export const wishlistService = new WishlistService();