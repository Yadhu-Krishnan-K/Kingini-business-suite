import type { Prisma } from "@repo/database";
import { prisma } from "@repo/database";


class OrderRepository {
  async createOrder(
    tx: Prisma.TransactionClient,
    data: Prisma.OrderCreateArgs["data"],
  ) {
    return tx.order.create({
      data,
      include: {
        items: true,
      },
    });
  }

  async findManyByUserId(
    userId: string,
    skip: number,
    take: number,
  ) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        subtotalAmount: true,
        discountAmount: true,
        totalAmount: true,
        orderStatus: true,
        paymentStatus: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            productName: true,
            size: true,
            color: true,
            quantity: true,
            price: true,
          },
        },
      },
    });
  }

  async countByUserId(userId: string) {
    return prisma.order.count({
      where: { userId },
    });
  }

  async findByIdAndUserId(orderId: string, userId: string) {
    return prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      select: {
        id: true,
        subtotalAmount: true,
        discountAmount: true,
        totalAmount: true,
        orderStatus: true,
        paymentStatus: true,
        createdAt: true,
        updatedAt: true,
        shippingFullName: true,
        shippingPhone: true,
        shippingAddressLine1: true,
        shippingAddressLine2: true,
        shippingCity: true,
        shippingState: true,
        shippingCountry: true,
        shippingPostalCode: true,
        items: {
          select: {
            id: true,
            productName: true,
            size: true,
            color: true,
            sku: true,
            quantity: true,
            price: true,
          },
        },
      },
    });
  }
}

export const orderRepository = new OrderRepository();