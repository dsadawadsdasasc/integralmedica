import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { categoriesQuery, productsQuery } from "@/lib/catalog.functions";
import { ProductCard } from "@/components/ProductCard";

interface ProductSearch {
  categoria?: string | undefined;
  busca?: string | undefined;
}

export const Route = createFileRoute("/produtos")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    categoria: typeof search["categoria"] === "string" ? search["categoria"] : undefined,
    busca: typeof search["busca"] === "string" ? search["busca"] : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(
        productsQuery({ category: deps.categoria, search: deps.busca }),
      ),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Produtos | Integralmédica" },
      {
        name: "description",
        content:
          "Catálogo completo de suplementos Integralmédica: proteínas, creatinas, pré-treinos, aminoácidos, hipercalóricos e barras.",
      },
      { property: "og:title", content: "Produtos | Integralmédica" },
      {
        property: "og:description",
        content: "Catálogo completo de suplementos Integralmédica com entrega para todo o Brasil.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(
    productsQuery({ category: search.categoria, search: search.busca }),
  );
  const current = categories.find((c) => c.slug === search.categoria);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-bold uppercase">
        {search.busca ? `Busca: ${search.busca}` : (current?.name ?? "Todos os produtos")}
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">{products.length} produto(s)</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <h2 className="text-sm font-bold uppercase">Categorias</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <Link
                to="/produtos"
                search={{ categoria: undefined, busca: undefined }}
                className={!search.categoria ? "text-primary font-bold" : "hover:underline"}
              >
                Todas
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to="/produtos"
                  search={{ categoria: c.slug, busca: undefined }}
                  className={
                    search.categoria === c.slug ? "text-primary font-bold" : "hover:underline"
                  }
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {products.length === 0 ? (
            <p className="text-muted-foreground">Nenhum produto encontrado.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
