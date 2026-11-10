"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

import { getAddresses } from "@/services/address";
import { getCart } from "@/services/cart";
import { createOrder } from "@/services/order";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  cancelRazorpayPayment,
} from "@/services/payment";

import type { Address } from "@/types/address";
import type { Cart } from "@/types/cart";

import { validateCoupon } from "@/services/coupon";

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    async function loadCheckout() {
      try {
        setLoading(true);
        setMessage("");

        const [cartResponse, addressResponse] = await Promise.all([
          getCart(),
          getAddresses(),
        ]);

        setCart(cartResponse.data);
        const loadedAddresses = addressResponse.data;

        setAddresses(loadedAddresses);

        const defaultAddress = loadedAddresses.find(
          (address) => address.isDefault,
        );

        setSelectedAddressId(defaultAddress?.id ?? loadedAddresses[0]?.id ?? null);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load checkout.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadCheckout();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p>Loading checkout...</p>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-4 text-3xl font-bold">Checkout</h1>
        <p>Your cart is empty.</p>
      </main>
    );
  }

  const subtotal = cart.items.reduce(
    (total, item) =>
      total + Number(item.variant.price) * item.quantity,
    0,
  );
  const total = subtotal - couponDiscount;

  async function handleApplyCoupon() {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code.");
      return;
    }

    try {
      setCouponLoading(true);
      setCouponMessage("");

      const response = await validateCoupon(
        couponCode,
        subtotal,
      );

      setCouponDiscount(response.data.discountAmount);
      setCouponMessage(
        `Coupon applied successfully. You saved ₹${response.data.discountAmount.toFixed(2)}.`,
      );
    } catch (error) {
      setCouponDiscount(0);
      setCouponMessage(
        error instanceof Error
          ? error.message
          : "Failed to apply coupon.",
      );
    } finally {
      setCouponLoading(false);
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      setMessage("Please select a shipping address.");
      return;
    }

    if (!window.Razorpay) {
      setMessage("Payment gateway is still loading. Please try again.");
      return;
    }

    try {
      setOrderLoading(true);
      setMessage("");

      const orderResponse = await createOrder({
        addressId: selectedAddressId,
        ...(couponDiscount > 0 && couponCode.trim()
          ? { couponCode: couponCode.trim() }
          : {}),
      });

      const paymentResponse = await createRazorpayOrder(
        orderResponse.data.id,
      );

      const razorpay = new window.Razorpay({
        key: paymentResponse.data.keyId,
        amount: paymentResponse.data.amount,
        currency: paymentResponse.data.currency,
        name: "Kingini",
        description: "Kingini Order Payment",
        order_id: paymentResponse.data.razorpayOrderId,

        handler: async (response) => {
          try {
            setMessage("");

            await verifyRazorpayPayment({
              orderId: orderResponse.data.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            window.location.href = `/orders/${orderResponse.data.id}/success`;
          } catch (error) {
            setMessage(
              error instanceof Error
                ? error.message
                : "Payment verification failed.",
            );
            setOrderLoading(false);
          }
        },

        modal: {
          ondismiss: async () => {
            try {
              await cancelRazorpayPayment(orderResponse.data.id);

              setMessage(
                "Payment was cancelled. Your cart and stock have been restored.",
              );
            } catch (error) {
              setMessage(
                error instanceof Error
                  ? error.message
                  : "Payment was cancelled, but restoring your cart failed.",
              );
            } finally {
              setOrderLoading(false);
            }
          },
        },
      });

      razorpay.open();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to start payment.",
      );
      setOrderLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      {message && (
        <p className="mb-6 text-sm text-red-600">
          {message}
        </p>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <section className="space-y-6 md:col-span-2">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Shipping Address
            </h2>

            {addresses.length === 0 ? (
              <p className="text-gray-500">
                No saved addresses found.
              </p>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`cursor-pointer rounded-lg border p-4 ${selectedAddressId === address.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
                      }`}
                  >
                    <p className="font-semibold">
                      {address.fullName}
                    </p>

                    <p className="text-sm text-gray-600">
                      {address.addressLine1}
                    </p>

                    {address.addressLine2 && (
                      <p className="text-sm text-gray-600">
                        {address.addressLine2}
                      </p>
                    )}

                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state}{" "}
                      {address.postalCode}
                    </p>

                    <p className="text-sm text-gray-600">
                      {address.country}
                    </p>

                    <p className="mt-2 text-sm">
                      Phone: {address.phone}
                    </p>

                    {address.isDefault && (
                      <span className="mt-2 inline-block rounded bg-gray-100 px-2 py-1 text-xs">
                        Default
                      </span>
                    )}
                    {selectedAddressId === address.id && (
                      <span className="mt-2 ml-2 inline-block rounded bg-black px-2 py-1 text-xs text-white">
                        Selected
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Order Items
            </h2>

            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">
                      {item.variant.product.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.variant.size} / {item.variant.color}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium">
                    ₹
                    {(
                      Number(item.variant.price) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Order Summary
          </h2>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="mt-6">
            <h3 className="mb-2 font-semibold">Coupon</h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Enter coupon code"
                className="min-w-0 flex-1 rounded border px-3 py-2"
              />

              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponLoading}
                className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
              >
                {couponLoading ? "Applying..." : "Apply"}
              </button>
            </div>

            {couponMessage && (
              <p
                className={`mt-2 text-sm ${couponDiscount > 0
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {couponMessage}
              </p>
            )}
          </div>

          <div className="mt-2 flex justify-between text-gray-500">
            <span>Discount</span>
            <span>₹{couponDiscount.toFixed(2)}</span>
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={orderLoading || !selectedAddressId}
            className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {orderLoading ? "Placing Order..." : "Place Order"}
          </button>
        </aside>
      </div>
    </main>
  );
}