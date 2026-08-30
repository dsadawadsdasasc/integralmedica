import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { formatBRL, type Product } from "@/lib/catalog-types";
import { productImage } from "@/lib/product-images";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.compare_at_cents
    ? Math.round((1 - product.price_cents / product.compare_at_cents) * 100)
    : 0;

  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group border-border bg-card flex flex-col overflow-hidden rounded-md border transition-shadow hover:shadow-lg"
    >
      <div className="bg-muted relative">
        {discount > 0 && (
          <span className="bg-primary text-primary-foreground absolute top-2 left-2 z-10 rounded px-2 py-0.5 text-xs font-bold">
            -{discount}%
          </span>
        )}
        {product.is_new && (
          <span className="bg-secondary text-secondary-foreground absolute top-2 right-2 z-10 rounded px-2 py-0.5 text-xs font-bold">
            NOVO
          </span>
        )}
        <img
          src={productImage(product.image_key)}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Star className="fill-primary text-primary size-3.5" />
          {product.rating.toFixed(1)} ({product.reviews_count})
        </div>
        <h3 className="mt-1.5 text-base leading-tight font-semibold">{product.name}</h3>
        <div className="mt-auto pt-3">
          {product.compare_at_cents && (
            <p className="text-muted-foreground text-xs line-through">
              {formatBRL(product.compare_at_cents)}
            </p>
          )}
          <p className="text-xl font-bold">{formatBRL(product.price_cents)}</p>
          <p className="text-muted-foreground text-xs">
            ou 12x de {formatBRL(Math.round(product.price_cents / 12))}
          </p>
        </div>
      </div>
    </Link>
  );
}
