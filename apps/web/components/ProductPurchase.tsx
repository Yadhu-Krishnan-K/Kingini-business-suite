"use client";

import { useState } from "react";

import type { ProductVariant } from "@/types/product";
import { ProductVariantSelector } from "@/components/ProductVariantSelector";
import { addToCart } from "@/services/cart";

interface ProductPurchaseProps {
  variants: ProductVariant[];
}

export function ProductPurchase({
  variants,
}: ProductPurchaseProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants[0] ?? null,
  );
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAddToCart() {
    if (!selectedVariant) return;

    try {
      setIsAdding(true);
      setMessage("");

      await addToCart(selectedVariant.id, 1);

      setMessage("Added to cart.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to add to cart.",
      );
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div>
      <ProductVariantSelector
        variants={variants}
        onVariantChange={setSelectedVariant}
      />

      <button
        type="button"
        disabled={
          !selectedVariant ||
          selectedVariant.stock <= 0 ||
          isAdding
        }
        onClick={handleAddToCart}
        className="mt-6 w-full rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>

      {message && (
        <p className="mt-3 text-sm">
          {message}
        </p>
      )}
    </div>
  );
}