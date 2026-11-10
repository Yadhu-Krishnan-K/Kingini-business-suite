"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getOrderHistory } from "@/services/order";
import type { OrderHistoryEntry } from "@/services/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderHistoryEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrderHistory(page);

      setOrders(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your orders.",
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/account"
            className="text-sm font-medium text-gray-500 hover:text-black"
          >
            ← My Account
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            My Orders
          </h1>

          <p className="mt-2 text-gray-600">
            View your purchases, payment status, and order details.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border bg-white p-8 text-center">
            Loading your orders...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => void loadOrders()}
              className="mt-4 rounded-lg bg-black px-4 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border bg-white px-6 py-16 text-center">
            <div className="text-4xl">🛍️</div>

            <h2 className="mt-4 text-xl font-semibold">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              Your purchases will appear here once you place an order.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
            >
              Explore Products
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <>
            <div className="space-y-5">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="mt-1 break-all font-mono text-sm font-semibold">
                        {order.id}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                        {order.orderStatus}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          order.paymentStatus === "PAID"
                            ? "bg-green-50 text-green-700"
                            : order.paymentStatus === "FAILED"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        Payment: {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 py-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between gap-4"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.productName}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Size: {item.size} · Color: {item.color}
                            {" · "}Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 font-medium">
                          ₹
                          {(
                            Number(item.price) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        Total amount
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </p>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="rounded-lg border border-gray-300 px-5 py-3 text-center font-semibold hover:bg-gray-50"
                    >
                      View Details →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border bg-white px-4 py-2 disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border bg-white px-4 py-2 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}