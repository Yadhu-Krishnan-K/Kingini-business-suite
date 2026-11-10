import Razorpay from "razorpay";
import crypto from "node:crypto";

import { prisma } from "@repo/database";
import { AppError } from "../../utils/AppError.ts";
import type {
    CreateRazorpayOrderDto,
    VerifyRazorpayPaymentDto,
    CancelRazorpayPaymentDto,
} from "./dto.ts";
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error("Razorpay environment variables are missing.");
}

export const razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
});

export async function createRazorpayOrder(
    userId: string,
    data: CreateRazorpayOrderDto,
) {
    const order = await prisma.order.findFirst({
        where: {
            id: data.orderId,
            userId,
        },
    });

    if (!order) {
        throw new AppError(404, "Order not found.");
    }

    if (order.paymentStatus === "PAID") {
        throw new AppError(400, "Order has already been paid.");
    }

    if (order.orderStatus === "CANCELLED") {
        throw new AppError(400, "Cancelled orders cannot be paid.");
    }

    if (order.razorpayOrderId) {
        return {
            razorpayOrderId: order.razorpayOrderId,
            amount: Math.round(Number(order.totalAmount) * 100),
            currency: "INR",
            keyId: razorpayKeyId,
        };
    }

    const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(Number(order.totalAmount) * 100),
        currency: "INR",
        receipt: order.id,
    });

    await prisma.order.update({
        where: {
            id: order.id,
        },
        data: {
            razorpayOrderId: razorpayOrder.id,
        },
    });

    return {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: razorpayKeyId,
    };
}

export async function verifyRazorpayPayment(
    userId: string,
    data: VerifyRazorpayPaymentDto,
) {
    const order = await prisma.order.findFirst({
        where: {
            id: data.orderId,
            userId,
        },
    });

    if (!order) {
        throw new AppError(404, "Order not found.");
    }

    if (!order.razorpayOrderId) {
        throw new AppError(400, "Razorpay order has not been created.");
    }

    if (order.razorpayOrderId !== data.razorpayOrderId) {
        throw new AppError(400, "Razorpay order ID does not match.");
    }

    if (order.paymentStatus === "PAID") {
        return {
            orderId: order.id,
            paymentStatus: order.paymentStatus,
            message: "Payment is already verified.",
        };
    }

    if (order.razorpayPaymentId) {
        throw new AppError(400, "A payment has already been recorded for this order.");
    }

    const generatedSignature = crypto
        .createHmac("sha256", razorpayKeySecret!)
        .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
        .digest("hex");

    if (generatedSignature !== data.razorpaySignature) {
        throw new AppError(400, "Invalid Razorpay payment signature.");
    }

    const updatedOrder = await prisma.order.update({
        where: {
            id: order.id,
        },
        data: {
            razorpayPaymentId: data.razorpayPaymentId,
            paymentStatus: "PAID",
            orderStatus: "CONFIRMED",
        },
    });

    return {
        orderId: updatedOrder.id,
        paymentStatus: updatedOrder.paymentStatus,
        message: "Payment verified successfully.",
    };
}

export async function cancelRazorpayPayment(
    userId: string,
    data: CancelRazorpayPaymentDto,
) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.findFirst({
            where: {
                id: data.orderId,
                userId,
            },
            include: {
                items: true,
            },
        });

        if (!order) {
            throw new AppError(404, "Order not found.");
        }

        // Payment already succeeded — never cancel or restore stock.
        if (order.paymentStatus === "PAID") {
            throw new AppError(
                400,
                "Paid orders cannot be cancelled as a payment cancellation.",
            );
        }

        // Already cancelled — nothing else should be restored.
        if (order.orderStatus === "CANCELLED") {
            return {
                orderId: order.id,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus,
                message: "Order is already cancelled.",
            };
        }

        // Restore reserved stock.
        for (const item of order.items) {
            await tx.productVariant.update({
                where: {
                    id: item.variantId,
                },
                data: {
                    stock: {
                        increment: item.quantity,
                    },
                },
            });
        }

        // Find or create the user's cart.
        let cart = await tx.cart.findUnique({
            where: {
                userId,
            },
            select: {
                id: true,
            },
        });

        if (!cart) {
            cart = await tx.cart.create({
                data: {
                    userId,
                },
                select: {
                    id: true,
                },
            });
        }

        // Restore the reserved quantities into the cart.
        // CartItem has @@unique([cartId, variantId]), so merge
        // with an existing item instead of creating duplicates.
        for (const item of order.items) {
            const existingCartItem = await tx.cartItem.findUnique({
                where: {
                    cartId_variantId: {
                        cartId: cart.id,
                        variantId: item.variantId,
                    },
                },
            });

            if (existingCartItem) {
                await tx.cartItem.update({
                    where: {
                        id: existingCartItem.id,
                    },
                    data: {
                        quantity: {
                            increment: item.quantity,
                        },
                    },
                });
            } else {
                await tx.cartItem.create({
                    data: {
                        cartId: cart.id,
                        variantId: item.variantId,
                        quantity: item.quantity,
                    },
                });
            }
        }

        const cancelledOrder = await tx.order.update({
            where: {
                id: order.id,
            },
            data: {
                orderStatus: "CANCELLED",
                paymentStatus: "FAILED",
            },
        });

        return {
            orderId: cancelledOrder.id,
            orderStatus: cancelledOrder.orderStatus,
            paymentStatus: cancelledOrder.paymentStatus,
            message: "Payment cancelled and reserved stock restored.",
        };
    });
}