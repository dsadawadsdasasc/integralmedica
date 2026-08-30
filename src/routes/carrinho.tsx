import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import { useCart, shippingFor } from "@/lib/cart";
import { formatBRL } from "@/lib/catalog-types";
import { productImage } from "@/lib/product-images";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho | Integralmédica" },
      { name: "description", content: "Revise os itens do seu carrinho e finalize sua compra." },
      { property: "og:title", content: "Carrinho | Integralmédica" },
      { property: "og:description", content: "Revise seus itens e finalize a compra." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, setQuantity, subtotal } = useCart();
  const shipping = shippingFor(subtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold uppercase">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground mt-2">Bora encher o carrinho de resultado.</p>
        <Button asChild className="mt-6 font-bold uppercase">
          <Link to="/produtos" search={{ categoria: undefined, busca: undefined }}>
            Ver produtos
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-bold uppercase">Carrinho</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product_id}-${item.flavor}`}
              className="border-border flex gap-4 rounded-md border p-4"
            >
              <img
                src={productImage(item.image_key)}
                alt={item.product_name}
                loading="lazy"
                width={800}
                height={800}
                className="bg-muted size-24 rounded object-cover"
              />
              <div className="flex-1">
                <Link
                  to="/produto/$slug"
                  params={{ slug: item.product_slug }}
                  className="font-semibold hover:underline"
                >
                  {item.product_name}
                </Link>
                <p className="text-muted-foreground text-xs">Sabor: {item.flavor}</p>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      setQuantity(item.product_id, item.flavor, Number(e.target.value))
                    }
                    className="border-border w-16 rounded border px-2 py-1 text-sm"
                    aria-label="Quantidade"
                  />
                  <button
                    onClick={() => remove(item.product_id, item.flavor)}
                    className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-xs"
                  >
                    <Trash2 className="size-4" /> Remover
                  </button>
                </div>
              </div>
              <p className="font-bold">{formatBRL(item.unit_price_cents * item.quantity)}</p>
            </div>
          ))}
        </div>

        <aside className="border-border h-fit rounded-md border p-5">
          <h2 className="text-lg font-bold uppercase">Resumo</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatBRL(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Frete</dt>
              <dd>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</dd>
            </div>
            <div className="border-border flex justify-between border-t pt-3 text-lg font-bold">
              <dt>Total</dt>
              <dd>{formatBRL(subtotal + shipping)}</dd>
            </div>
          </dl>
          <Button asChild size="lg" className="mt-5 w-full font-bold uppercase">
            <Link to="/checkout">Finalizar compra</Link>
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full text-xs">
            <Link to="/produtos" search={{ categoria: undefined, busca: undefined }}>
              Continuar comprando
            </Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
