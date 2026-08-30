import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Star, Truck, ShieldCheck, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { productQuery } from "@/lib/catalog.functions";
import { formatBRL } from "@/lib/catalog-types";
import { productImage } from "@/lib/product-images";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!data) throw notFound();
    return { name: data.product.name, description: data.product.description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Produto indisponível" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} | Integralmédica`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description.slice(0, 155) },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold uppercase">Produto não encontrado</h1>
      <Button asChild className="mt-6">
        <Link to="/produtos" search={{ categoria: undefined, busca: undefined }}>
          Ver catálogo
        </Link>
      </Button>
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const { add } = useCart();
  const navigate = useNavigate();
  const product = data!.product;
  const [flavor, setFlavor] = useState(product.flavors[0] ?? "Único");
  const [qty, setQty] = useState(1);

  function addToCart() {
    add({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      image_key: product.image_key,
      flavor,
      unit_price_cents: product.price_cents,
      quantity: qty,
    });
    toast.success("Produto adicionado ao carrinho");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="text-muted-foreground mb-6 text-xs">
        <Link to="/">Home</Link> ·{" "}
        <Link to="/produtos" search={{ categoria: undefined, busca: undefined }}>
          Produtos
        </Link>{" "}
        · <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="bg-muted overflow-hidden rounded-md">
          <img
            src={productImage(product.image_key)}
            alt={product.name}
            width={800}
            height={800}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold uppercase">{product.name}</h1>
          <div className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
            <Star className="fill-primary text-primary size-4" />
            {product.rating.toFixed(1)} · {product.reviews_count} avaliações
          </div>

          <div className="mt-6">
            {product.compare_at_cents && (
              <p className="text-muted-foreground text-sm line-through">
                {formatBRL(product.compare_at_cents)}
              </p>
            )}
            <p className="text-4xl font-bold">{formatBRL(product.price_cents)}</p>
            <p className="text-muted-foreground text-sm">
              ou 12x de {formatBRL(Math.round(product.price_cents / 12))} sem juros
            </p>
          </div>

          {product.flavors.length > 1 && (
            <div className="mt-6">
              <p className="text-sm font-bold uppercase">Sabor</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.flavors.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFlavor(f)}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      flavor === f
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="border-border flex items-center rounded-md border">
              <button
                className="px-3 py-2"
                aria-label="Diminuir"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                className="px-3 py-2"
                aria-label="Aumentar"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button size="lg" className="flex-1 font-bold uppercase" onClick={addToCart}>
              Adicionar ao carrinho
            </Button>
          </div>

          <Button
            size="lg"
            variant="secondary"
            className="mt-3 w-full font-bold uppercase"
            onClick={() => {
              addToCart();
              navigate({ to: "/carrinho" });
            }}
          >
            Comprar agora
          </Button>

          <div className="text-muted-foreground mt-6 space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <Truck className="text-primary size-4" /> Frete grátis acima de R$ 250
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="text-primary size-4" /> Produto original e lacrado
            </p>
          </div>

          <div className="border-border mt-8 border-t pt-6">
            <h2 className="text-lg font-bold uppercase">Descrição</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {data!.related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold uppercase">Você também pode gostar</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {data!.related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
