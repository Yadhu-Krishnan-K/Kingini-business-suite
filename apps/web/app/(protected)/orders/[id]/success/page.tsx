
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getOrderDetails } from "@/services/order";
import type { OrderDetails } from "@/services/order";

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function OrderSuccessPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrderDetails(orderId);
      setOrder(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load order information.",
      );
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-gray-600">
          Your order has been created. You can check its current status below.
        </p>

        <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="mt-1 break-all font-mono text-sm font-semibold text-gray-900">
            {orderId}
          </p>

          {loading ? (
            <p className="mt-4 text-sm text-gray-500">
              Loading order status...
            </p>
          ) : error ? (
            <div className="mt-4">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => void loadOrder()}
                className="mt-2 text-sm font-semibold underline"
              >
                Try Again
              </button>
            </div>
          ) : order ? (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {formatStatus(order.orderStatus)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {formatStatus(order.paymentStatus)}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products"
            className="flex-1 rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>

          <Link
            href={`/orders/${orderId}`}
            className="flex-1 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            View Order
          </Link>
        </div>
      </div>
    </main>
  );
}
