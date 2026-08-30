import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import type { Order } from "./catalog-types";

export interface CheckoutInput {
  items: {
    product_id: string;
    product_name: string;
    product_slug: string;
    image_key: string;
    flavor: string;
    unit_price_cents: number;
    quantity: number;
  }[];
  shipping_cents: number;
  payment_method: string;
  customer_name: string;
  email: string;
  phone: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
}

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: CheckoutInput) => {
    if (!input.items?.length) throw new Error("Carrinho vazio");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const subtotal = data.items.reduce((sum, i) => sum + i.unit_price_cents * i.quantity, 0);
    const total = subtotal + data.shipping_cents;

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        subtotal_cents: subtotal,
        shipping_cents: data.shipping_cents,
        total_cents: total,
        payment_method: data.payment_method,
        customer_name: data.customer_name,
        email: data.email,
        phone: data.phone,
        cep: data.cep,
        address: data.address,
        number: data.number,
        complement: data.complement,
        district: data.district,
        city: data.city,
        state: data.state,
      })
      .select("id, order_number")
      .single();
    if (error) throw new Error(error.message);

    const items = data.items.map((i) => ({ ...i, order_id: (order as { id: string }).id }));
    const { error: itemsError } = await supabase.from("order_items").insert(items);
    if (itemsError) throw new Error(itemsError.message);

    return order as { id: string; order_number: string };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select(
        "id, order_number, status, subtotal_cents, shipping_cents, total_cents, payment_method, customer_name, city, state, created_at, order_items(id, product_name, product_slug, image_key, flavor, unit_price_cents, quantity)",
      )
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as Order[];
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("id, full_name, phone, cpf")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as { id: string; full_name: string; phone: string; cpf: string } | null;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { full_name: string; phone: string; cpf: string }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .upsert({ id: context.userId, ...data, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
