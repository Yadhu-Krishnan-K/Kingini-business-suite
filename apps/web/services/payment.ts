import { apiFetch } from "@/lib/api";

export type CreateRazorpayOrderResponse = {
    razorpayOrderId: string;
    amount: number;
    currency: string;
    keyId: string;
};

export async function createRazorpayOrder(orderId: string) {
    return apiFetch<{ data: CreateRazorpayOrderResponse }>(
        "/payments/razorpay/order",
        {
            method: "POST",
            body: JSON.stringify({
                orderId,
            }),
        },
    );
}

export type VerifyRazorpayPaymentInput = {
    orderId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
};

export type VerifyRazorpayPaymentResponse = {
    orderId: string;
    paymentStatus: string;
    message: string;
};

export async function verifyRazorpayPayment(
    data: VerifyRazorpayPaymentInput,
) {
    return apiFetch<{ data: VerifyRazorpayPaymentResponse }>(
        "/payments/razorpay/verify",
        {
            method: "POST",
            body: JSON.stringify(data),
        },
    );
}

export async function cancelRazorpayPayment(orderId: string) {
    return apiFetch<{
        data: {
            orderId: string;
            orderStatus: string;
            paymentStatus: string;
            message: string;
        };
    }>("/payments/razorpay/cancel", {
        method: "POST",
        body: JSON.stringify({
            orderId,
        }),
    });
}