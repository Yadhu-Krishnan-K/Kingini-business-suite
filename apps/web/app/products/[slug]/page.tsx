import { ProductPurchase } from "@/components/ProductPurchase";
import { getProductBySlug } from "@/services/products";
import { AddToWishlistButton } from "@/components/AddToWishlistButton";

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductPage({
    params,
}: ProductPageProps) {
    const { slug } = await params;
    const response = await getProductBySlug(slug);

    const product = response.data;

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            <div className="grid gap-10 md:grid-cols-2">
                <div>
                    {product.images[0] ? (
                        <img
                            src={product.images[0].imageUrl}
                            alt={product.name}
                            className="w-full rounded-xl object-cover"
                        />
                    ) : (
                        <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                            No image
                        </div>
                    )}
                </div>

                <div>
                    <p className="text-sm text-gray-500">{product.brand}</p>

                    <h1 className="mt-2 text-3xl font-bold">
                        {product.name}
                    </h1>

                    <p className="mt-4 text-lg text-gray-700">
                        {product.description}
                    </p>

                    <p className="mt-6 text-2xl font-bold">
                        ₹{product.variants[0]?.price}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        {product.variants.some((variant) => variant.stock > 0)
                            ? "In stock"
                            : "Out of stock"}
                    </p>

                    <ProductPurchase variants={product.variants} />
                    
                    <AddToWishlistButton productId={product.id} />
                </div>
            </div>
        </main>
    );
}