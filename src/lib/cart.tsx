import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  product_id: string;
  product_name: string;
  product_slug: string;
  image_key: string;
  flavor: string;
  unit_price_cents: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (product_id: string, flavor: string) => void;
  setQuantity: (product_id: string, flavor: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "integral-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const value = useMemo<CartContextValue>(() => {
    const same = (i: CartItem, id: string, flavor: string) =>
      i.product_id === id && i.flavor === flavor;
    return {
      items,
      add: (item) =>
        setItems((prev) => {
          const found = prev.find((i) => same(i, item.product_id, item.flavor));
          if (found) {
            return prev.map((i) =>
              same(i, item.product_id, item.flavor)
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            );
          }
          return [...prev, item];
        }),
      remove: (id, flavor) => setItems((prev) => prev.filter((i) => !same(i, id, flavor))),
      setQuantity: (id, flavor, quantity) =>
        setItems((prev) =>
          prev.map((i) => (same(i, id, flavor) ? { ...i, quantity: Math.max(1, quantity) } : i)),
        ),
      clear: () => setItems([]),
      count: items.reduce((s, i) => s + i.quantity, 0),
      subtotal: items.reduce((s, i) => s + i.quantity * i.unit_price_cents, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function shippingFor(subtotal: number) {
  if (subtotal === 0) return 0;
  return subtotal >= 25000 ? 0 : 1990;
}
