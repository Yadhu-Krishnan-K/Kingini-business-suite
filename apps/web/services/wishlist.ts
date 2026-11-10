import { apiFetch } from "@/lib/api";

import type { WishlistResponse } from "@/types/wishlist";

export async function getWishlist() {
  return apiFetch<WishlistResponse>("/wishlist");
}

export async function addToWishlist(productId: string) {
  return apiFetch<WishlistResponse>("/wishlist/items", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export async function removeFromWishlist(productId: string) {
  return apiFetch<WishlistResponse>(
    `/wishlist/items/${productId}`,
    {
      method: "DELETE",
    },
  );
}

export async function clearWishlist() {
  return apiFetch<WishlistResponse>("/wishlist", {
    method: "DELETE",
  });
}