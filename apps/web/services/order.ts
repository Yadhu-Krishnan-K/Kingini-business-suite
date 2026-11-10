import { apiFetch } from "@/lib/api";

export type CreateOrderInput = {
  addressId: string;
  couponCode?: string;
};

export type Order = {
  id: string;
  totalAmount: string | number;
  orderStatus: string;
  paymentStatus: string;
};

export type OrderHistoryItem = {
  id: string;
  productName: string;
  size: string;
  color: string;
  sku: string;
  quantity: number;
  price: string | number;
};

export type OrderHistoryEntry = {
  id: string;
  subtotalAmount: string | number;
  discountAmount: string | number;
  totalAmount: string | number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderHistoryItem[];
};

export type OrderHistoryResponse = {
  data: OrderHistoryEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getOrderHistory(page = 1, limit = 10) {
  return apiFetch<OrderHistoryResponse>(
    `/orders?page=${page}&limit=${limit}`,
  );
}

export async function createOrder(data: CreateOrderInput) {
  return apiFetch<{ data: Order }>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type OrderDetails = OrderHistoryEntry & {
  updatedAt: string;
  shippingFullName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingPostalCode: string;
  items: (OrderHistoryItem & {
    sku: string;
  })[];
};

export async function getOrderDetails(orderId: string) {
  return apiFetch<{ data: OrderDetails }>(
    `/orders/${encodeURIComponent(orderId)}`,
  );
}