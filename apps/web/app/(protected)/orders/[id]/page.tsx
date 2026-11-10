"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getOrderDetails } from "@/services/order";
import type { OrderDetails } from "@/services/order";

function formatPrice(amount: string | number) {
  return `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          : "Unable to load order details.",
      );
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-4xl animate-pulse rounded-xl bg-white p-8">
          Loading order details...
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to load order
          </h1>
          <p className="mt-3 text-gray-600">
            {error || "Order not found."}
          </p>

          <button
            onClick={() => void loadOrder()}
            className="mt-6 rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Try Again
          </button>

          <div>
            <Link
              href="/orders"
              className="mt-4 inline-block text-sm font-medium text-gray-700 underline"
            >
              Back to My Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/orders"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to My Orders
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order Details
            </h1>
            <p className="mt-2 break-all text-sm text-gray-500">
              Order ID: {order.id}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          <Link
            href="/products"
            className="rounded-lg bg-black px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Order & Payment Status
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Order Status</p>
              <p className="mt-2 font-semibold text-gray-900">
                {formatStatus(order.orderStatus)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Payment Status</p>
              <p className="mt-2 font-semibold text-gray-900">
                {formatStatus(order.paymentStatus)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Items Ordered ({order.items.length})
          </h2>

          <div className="mt-4 divide-y divide-gray-100">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-3 py-5 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.productName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Size: {item.size} · Color: {item.color}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    SKU: {item.sku}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-gray-900">
                  {formatPrice(Number(item.price) * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Price Summary
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotalAmount)}</span>
            </div>

            <div className="flex justify-between gap-4 text-gray-600">
              <span>Discount</span>
              <span>-{formatPrice(order.discountAmount)}</span>
            </div>

            <div className="flex justify-between gap-4 border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Shipping Address
          </h2>

          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <p className="font-semibold text-gray-900">
              {order.shippingFullName}
            </p>
            <p>{order.shippingPhone}</p>
            <p>{order.shippingAddressLine1}</p>

            {order.shippingAddressLine2 && (
              <p>{order.shippingAddressLine2}</p>
            )}

            <p>
              {order.shippingCity}, {order.shippingState}
            </p>
            <p>
              {order.shippingPostalCode}, {order.shippingCountry}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}