"use client";

import { useState } from "react";
import { addToWishlist } from "@/services/wishlist";

interface AddToWishlistButtonProps {
    productId: string;
}

export function AddToWishlistButton({
    productId,
}: AddToWishlistButtonProps) {
    const [message, setMessage] = useState("");

    async function handleAddToWishlist() {
        try {
            setMessage("");

            await addToWishlist(productId);

            setMessage("Product added to wishlist.");
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to add product to wishlist.",
            );
        }
    }

    return (
        <div className="mt-4">
            <button
                onClick={handleAddToWishlist}
                className="rounded-md border px-5 py-3 text-sm font-medium hover:bg-gray-100"
            >
                ♡ Add to Wishlist
            </button>

            {message && (
                <p className="mt-2 text-sm text-gray-600">
                    {message}
                </p>
            )}
        </div>
    );
}