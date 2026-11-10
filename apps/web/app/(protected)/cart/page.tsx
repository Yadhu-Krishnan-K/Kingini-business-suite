"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart";

import type { Cart } from "@/types/cart";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadCart() {
    try {
      setLoading(true);
      setMessage("");

      const response = await getCart();
      setCart(response.data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to load cart.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleUpdate(
    variantId: string,
    quantity: number,
  ) {
    try {
      setMessage("");

      const response = await updateCartItem(
        variantId,
        quantity,
      );

      setCart(response.data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to update cart.",
      );
    }
  }

  async function handleRemove(variantId: string) {
    try {
      setMessage("");

      const response = await removeCartItem(variantId);

      setCart(response.data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to remove item.",
      );
    }
  }

  async function handleClear() {
    try {
      setMessage("");

      const response = await clearCart();

      setCart(response.data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to clear cart.",
      );
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p>Loading cart...</p>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
        <p>Your cart is empty.</p>
      </main>
    );
  }

  const subtotal = cart.items.reduce(
    (total, item) =>
      total +
      Number(item.variant.price) * item.quantity,
    0,
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Cart</h1>

        <button
          type="button"
          onClick={handleClear}
          className="rounded border px-4 py-2 text-sm hover:bg-gray-100"
        >
          Clear Cart
        </button>
      </div>

      {message && (
        <p className="mb-6 text-sm text-red-600">
          {message}
        </p>
      )}

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <h2 className="font-semibold">
                {item.variant.product.name}
              </h2>

              <p className="text-sm text-gray-500">
                {item.variant.product.brand}
              </p>

              <p className="mt-1 text-sm">
                {item.variant.size} / {item.variant.color}
              </p>

              <p className="mt-1 font-medium">
                ₹{Number(item.variant.price).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={item.quantity <= 1}
                onClick={() =>
                  handleUpdate(
                    item.variantId,
                    item.quantity - 1,
                  )
                }
                className="h-8 w-8 rounded border disabled:opacity-40"
              >
                −
              </button>

              <span className="w-6 text-center">
                {item.quantity}
              </span>

              <button
                type="button"
                disabled={
                  item.quantity >= item.variant.stock
                }
                onClick={() =>
                  handleUpdate(
                    item.variantId,
                    item.quantity + 1,
                  )
                }
                className="h-8 w-8 rounded border disabled:opacity-40"
              >
                +
              </button>

              <button
                type="button"
                onClick={() =>
                  handleRemove(item.variantId)
                }
                className="ml-4 text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <p className="text-xl font-bold">
          Subtotal: ₹{subtotal.toFixed(2)}
        </p>

        <Link
          href="/checkout"
          className="rounded bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
        >
          Proceed to Checkout
        </Link>
      </div>
    </main>
  );
}