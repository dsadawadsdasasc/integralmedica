import { Link } from "@tanstack/react-router";

import { formatBRL, installments, type Product } from "@/lib/catalog-types";
import { productImage } from "@/lib/product-images";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.compare_at_cents
    ? Math.round((1 - product.price_cents / product.compare_at_cents) * 100)
    : 0;
  const parcela = installments(product.price_cents);
  const tags = product.tags ?? [];

  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group border-border bg-card flex flex-col overflow-hidden rounded-md border transition-shadow hover:shadow-lg"
    >
      <div className="bg-muted relative">
        {discount > 0 && (
          <span className="bg-primary text-primary-foreground absolute top-2 left-2 z-10 rounded px-2 py-0.5 text-xs font-bold">
            {discount}% OFF
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
        {tags.length > 0 && (
          <ul className="text-muted-foreground flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-semibold uppercase">
            {tags.map((t) => (
              <li key={t} className="border-border rounded-sm border px-1.5 py-0.5">
                {t}
              </li>
            ))}
          </ul>
        )}
        <h3 className="mt-2 text-base leading-tight font-semibold">{product.name}</h3>
        <div className="mt-auto pt-3">
          {product.compare_at_cents && (
            <p className="text-muted-foreground text-xs">
              De: <span className="line-through">{formatBRL(product.compare_at_cents)}</span> Por:
            </p>
          )}
          <p className="text-xl font-bold">{formatBRL(product.price_cents)}</p>
          {parcela && (
            <p className="text-muted-foreground text-xs">
              ou {parcela.count}x de {formatBRL(parcela.value)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
