"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
    getWishlist,
    removeFromWishlist,
    clearWishlist,
} from "@/services/wishlist";

import type { Wishlist } from "@/types/wishlist";

export default function WishlistPage() {

    const { user, loading: authLoading } = useAuth();

    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    async function loadWishlist() {
        try {
            setLoading(true);
            setMessage("");

            const response = await getWishlist();
            setWishlist(response.data);
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to load wishlist.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (authLoading || !user) {
            return;
        }

        loadWishlist();
    }, [authLoading, user]);

    async function handleRemove(productId: string) {
        try {
            setMessage("");

            const response = await removeFromWishlist(productId);
            setWishlist(response.data);
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to remove product.",
            );
        }
    }

    async function handleClear() {
        try {
            setMessage("");

            const response = await clearWishlist();
            setWishlist(response.data);
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to clear wishlist.",
            );
        }
    }

    if (authLoading) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <p>Checking authentication...</p>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <p>Loading wishlist...</p>
            </main>
        );
    }

    if (!wishlist) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <p>{message || "Failed to load wishlist."}</p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Wishlist</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {wishlist.items.length}{" "}
                        {wishlist.items.length === 1 ? "item" : "items"}
                    </p>
                </div>

                {wishlist.items.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        Clear Wishlist
                    </button>
                )}
            </div>

            {message && (
                <p className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-600">
                    {message}
                </p>
            )}

            {wishlist.items.length === 0 ? (
                <div className="py-20 text-center">
                    <h2 className="text-xl font-semibold">
                        Your wishlist is empty
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Add products you want to save for later.
                    </p>

                    <Link
                        href="/products"
                        className="mt-6 inline-block rounded-md bg-black px-5 py-3 text-sm font-medium text-white"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlist.items.map((item) => {
                        const product = item.product;
                        const image = product.images[0];

                        const firstVariant = product.variants[0];
                        const price = firstVariant ? Number(firstVariant.price) : 0;

                        return (
                            <div
                                key={item.id}
                                className="overflow-hidden rounded-lg border"
                            >
                                <Link href={`/products/${product.slug}`}>
                                    {image ? (
                                        <img
                                            src={image.imageUrl}
                                            alt={product.name}
                                            className="h-64 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-64 items-center justify-center bg-gray-100 text-gray-500">
                                            No image
                                        </div>
                                    )}
                                </Link>

                                <div className="p-4">
                                    <Link href={`/products/${product.slug}`}>
                                        <h2 className="font-semibold hover:underline">
                                            {product.name}
                                        </h2>
                                    </Link>

                                    {product.brand && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {product.brand}
                                        </p>
                                    )}

                                    <p className="mt-2 font-medium">
                                        ₹{price.toLocaleString("en-IN")}
                                    </p>

                                    <button
                                        onClick={() => handleRemove(product.id)}
                                        className="mt-4 w-full rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}