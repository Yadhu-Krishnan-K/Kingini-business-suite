import type { Product } from "./product";

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  createdAt: string;
  product: Product;
}

export interface Wishlist {
  id: string;
  userId: string;
  createdAt: string;
  items: WishlistItem[];
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  data: Wishlist;
}