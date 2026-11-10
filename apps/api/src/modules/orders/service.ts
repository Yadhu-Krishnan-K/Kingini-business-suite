import { prisma } from "@repo/database";
import type { Prisma } from "@repo/database";

import { AppError } from "../../utils/AppError.ts";
import { cartRepository } from "../cart/repository.ts";
import { couponService } from "../coupons/service.ts";
import { orderRepository } from "./repository.ts";
import type { CreateOrderDto, OrderHistoryQuery } from "./dto.ts";

type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        variant: {
          include: {
            product: true;
          };
        };
      };
    };
  };
}>;

type VariantWithProduct = Prisma.ProductVariantGetPayload<{
  include: {
    product: true;
  };
}>;

class OrderService {
  async createOrder(userId: string, data: CreateOrderDto) {
    const cart = (await cartRepository.findByUserId(
      userId,
    )) as CartWithItems | null;

    if (!cart || cart.items.length === 0) {
      throw new AppError(400, "Cart is empty.");
    }

    const address = await prisma.address.findFirst({
      where: {
        id: data.addressId,
        userId,
      },
    });

    if (!address) {
      throw new AppError(404, "Shipping address not found.");
    }

    const variantIds = cart.items.map((item) => item.variantId);

    const variants: VariantWithProduct[] =
      await prisma.productVariant.findMany({
        where: {
          id: {
            in: variantIds,
          },
        },
        include: {
          product: true,
        },
      });

    if (variants.length !== cart.items.length) {
      throw new AppError(
        400,
        "One or more cart items are no longer available.",
      );
    }

    const variantMap = new Map(
      variants.map((variant) => [variant.id, variant]),
    );

    let subtotal = 0;

    for (const cartItem of cart.items) {
      const variant = variantMap.get(cartItem.variantId);

      if (!variant) {
        throw new AppError(
          400,
          "Cart contains an unavailable product.",
        );
      }

      if (variant.stock < cartItem.quantity) {
        throw new AppError(
          400,
          `Insufficient stock for ${variant.product.name}.`,
        );
      }

      subtotal += Number(variant.price) * cartItem.quantity;
    }

    let discountAmount = 0;

    if (data.couponCode) {
      const coupon = await couponService.validateCoupon(
        data.couponCode,
        subtotal,
      );

      discountAmount = coupon.discountAmount;
    }

    const totalAmount = subtotal - discountAmount;

    return prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const order = await orderRepository.createOrder(tx, {
          userId,
          subtotalAmount: subtotal,
          discountAmount,
          totalAmount,

          shippingFullName: address.fullName,
          shippingPhone: address.phone,
          shippingAddressLine1: address.addressLine1,
          shippingAddressLine2: address.addressLine2,
          shippingCity: address.city,
          shippingState: address.state,
          shippingCountry: address.country,
          shippingPostalCode: address.postalCode,

          items: {
            create: cart.items.map((cartItem) => {
              const variant = variantMap.get(cartItem.variantId)!;

              return {
                variantId: variant.id,
                productName: variant.product.name,
                size: variant.size,
                color: variant.color,
                sku: variant.sku,
                quantity: cartItem.quantity,
                price: variant.price,
              };
            }),
          },
        });

        for (const cartItem of cart.items) {
          const updated = await tx.productVariant.updateMany({
            where: {
              id: cartItem.variantId,
              stock: {
                gte: cartItem.quantity,
              },
            },
            data: {
              stock: {
                decrement: cartItem.quantity,
              },
            },
          });

          if (updated.count !== 1) {
            throw new AppError(
              400,
              "Stock changed while placing the order. Please try again.",
            );
          }
        }

        await tx.cartItem.deleteMany({
          where: {
            cartId: cart.id,
          },
        });

        return order;
      },
    );
  }

  async getOrderHistory(
    userId: string,
    query: OrderHistoryQuery,
  ) {
    const skip = (query.page - 1) * query.limit;

    const [orders, total] = await Promise.all([
      orderRepository.findManyByUserId(
        userId,
        skip,
        query.limit,
      ),
      orderRepository.countByUserId(userId),
    ]);

    return {
      orders,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async getOrderDetails(orderId: string, userId: string) {
    const order = await orderRepository.findByIdAndUserId(
      orderId,
      userId,
    );

    if (!order) {
      throw new AppError(404, "Order not found.");
    }

    return order;
  }
}

export const orderService = new OrderService();