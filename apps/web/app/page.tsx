import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/services/products";

export default async function Home() {
  const response = await getProducts();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1>Kingini Products</h1>

      {response.data.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
          {response.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}