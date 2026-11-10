import { apiFetch } from "@/lib/api";

import type { Cart } from "@/types/cart";

export async function addToCart(
  variantId: string,
  quantity: number,
) {
  return apiFetch<{ data: Cart }>("/cart/items", {
    method: "POST",
    body: JSON.stringify({
      variantId,
      quantity,
    }),
  });
}

export async function getCart() {
  return apiFetch<{ data: Cart }>("/cart");
}

export async function updateCartItem(
  variantId: string,
  quantity: number,
) {
  return apiFetch<{ data: Cart }>("/cart/items", {
    method: "PATCH",
    body: JSON.stringify({
      variantId,
      quantity,
    }),
  });
}

export async function removeCartItem(variantId: string) {
  return apiFetch<{ data: Cart }>(
    `/cart/items/${variantId}`,
    {
      method: "DELETE",
    },
  );
}

export async function clearCart() {
  return apiFetch<{ data: Cart }>("/cart", {
    method: "DELETE",
  });
}