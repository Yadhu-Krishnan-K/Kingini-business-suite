"use client";

import { useState } from "react";

import type { ProductVariant } from "@/types/product";

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant) => void;
}

export function ProductVariantSelector({
  variants,
  onVariantChange
}: ProductVariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id ?? "",
  );

  const selectedVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  );

  if (!variants.length) {
    return <p className="text-gray-500">No variants available.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold">Choose variant</h2>

      <div className="mt-3 flex flex-wrap gap-3">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => {
                setSelectedVariantId(variant.id);
                onVariantChange(variant);
            }}
            className={`rounded-lg border px-4 py-2 ${
              selectedVariantId === variant.id
                ? "border-black bg-black text-white"
                : "border-gray-300 bg-white"
            }`}
          >
            {variant.size} / {variant.color}
          </button>
        ))}
      </div>

      {selectedVariant && (
        <div className="mt-4">
          <p className="font-semibold">₹{selectedVariant.price}</p>

          <p className="mt-1 text-sm text-gray-500">
            {selectedVariant.stock > 0
              ? `${selectedVariant.stock} available`
              : "Out of stock"}
          </p>
        </div>
      )}
    </div>
  );
}