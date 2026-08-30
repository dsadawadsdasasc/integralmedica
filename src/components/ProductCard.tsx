import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { formatBRL, installments, type Product } from "@/lib/catalog-types";
import { productImage } from "@/lib/product-images";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const discount = product.compare_at_cents
    ? Math.round((1 - product.price_cents / product.compare_at_cents) * 100)
    : 0;
  const parcela = installments(product.price_cents);
  const tags = product.tags ?? [];

  return (
    <article className="group bg-card flex min-w-0 flex-col">
      <Link to="/produto/$slug" params={{ slug: product.slug }} className="relative block">
        <div className="bg-muted relative overflow-hidden">
        {discount > 0 && (
          <span className="bg-primary text-primary-foreground absolute top-2 left-2 z-10 rounded-sm px-2 py-0.5 text-[10px] font-bold">
            {discount}% OFF
          </span>
        )}
        <img
          src={productImage(product.image_key, product.image_url)}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="aspect-square w-full bg-white object-contain transition-transform duration-300 group-hover:scale-[1.02]"
        />
        </div>
        <Heart className="text-foreground absolute top-2 right-2 size-5 fill-background stroke-[1.5]" aria-hidden="true" />
      </Link>
      <div className="flex flex-1 flex-col pt-2">
        {tags.length > 0 && (
          <ul className="flex min-h-11 flex-wrap content-start gap-1 text-[8px] font-bold uppercase">
            {tags.map((t) => (
              <li key={t} className="bg-secondary text-secondary-foreground px-1.5 py-0.5">
                {t}
              </li>
            ))}
          </ul>
        )}
        <Link to="/produto/$slug" params={{ slug: product.slug }}>
          <h3 className="mt-2 min-h-12 text-[14px] leading-snug font-semibold">{product.name}</h3>
        </Link>
        <div className="mt-auto min-h-20 pt-3">
          {product.compare_at_cents && (
            <p className="text-muted-foreground text-[11px]">
              De: <span className="line-through">{formatBRL(product.compare_at_cents)}</span> Por:
            </p>
          )}
          <p className="text-primary text-[17px] font-bold">{formatBRL(product.price_cents)}</p>
          {parcela && (
            <p className="text-foreground text-[10px]">
              ou {parcela.count}x de {formatBRL(parcela.value)}
            </p>
          )}
        </div>
        <Button
          variant="secondary"
          className="mt-2 h-11 w-full rounded-sm text-xs font-bold italic"
          onClick={() => {
            add({
              product_id: product.id,
              product_name: product.name,
              product_slug: product.slug,
              image_key: product.image_key,
              flavor: product.flavors[0] ?? "Único",
              unit_price_cents: product.price_cents,
              quantity: 1,
            });
            toast.success("Produto adicionado ao carrinho");
          }}
        >
          Adicionar ao carrinho
        </Button>
      </div>
    </article>
  );
}
