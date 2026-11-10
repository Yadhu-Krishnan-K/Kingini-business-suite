import Link from "next/link";

import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const lowestPrice = Math.min(
    ...product.variants.map((variant) => Number(variant.price)),
  );

  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        {product.images[0] ? (
          <img
            src={product.images[0].imageUrl}
            alt={product.name}
            className="h-72 w-full object-cover"
          />
        ) : (
          <div className="flex h-72 items-center justify-center bg-gray-100 text-gray-500">
            No image
          </div>
        )}

        <div className="p-4">
          <p className="text-sm text-gray-500">{product.brand}</p>

          <h2 className="mt-1 text-lg font-semibold">
            {product.name}
          </h2>

          <p className="mt-2 text-base font-medium">
            ₹{lowestPrice}
          </p>
        </div>
      </Link>
    </article>
  );
}