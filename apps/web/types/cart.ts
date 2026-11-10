export interface CartProduct {
  id: string;
  name: string;
  brand: string;
  slug: string;
}

export interface CartVariant {
  id: string;
  size: string;
  color: string;
  price: string;
  stock: number;
  product: CartProduct;
}

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  variant: CartVariant;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}