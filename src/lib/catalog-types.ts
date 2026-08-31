export interface Category {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category_id: string;
  price_cents: number;
  compare_at_cents: number | null;
  image_key: string;
  image_url?: string | null;
  tags?: string[];
  flavors: string[];
  rating: number;
  reviews_count: number;
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  sort_order?: number;
}

export interface OrderItem {
  id: string;
  product_name: string;
  product_slug: string;
  image_key: string;
  flavor: string;
  unit_price_cents: number;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  payment_method: string;
  customer_name: string;
  city: string;
  state: string;
  created_at: string;
  order_items: OrderItem[];
}

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Mesma regra da loja oficial: parcelas de no mínimo R$ 50, até 6x. */
export function installments(cents: number): { count: number; value: number } | null {
  const count = Math.min(6, Math.floor(cents / 5000));
  if (count < 2) return null;
  return { count, value: cents / count };
}
