import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";

import { categoriesQuery, productsQuery } from "@/lib/catalog.functions";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Integralmédica | Suplementos e Whey Protein de Alta Performance" },
      {
        name: "description",
        content:
          "Loja oficial Integralmédica: whey protein, creatina, pré-treino, barras e mais. Frete grátis acima de R$ 250 e até 12x sem juros.",
      },
      { property: "og:title", content: "Integralmédica | Suplementos de Alta Performance" },
      {
        property: "og:description",
        content: "Whey protein, creatina, pré-treino e muito mais com entrega para todo o Brasil.",
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(productsQuery({})),
    ]);
  },
  component: Home,
});

function Home() {
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery({}));
  const featured = products.filter((p) => p.is_featured).slice(0, 8);
  const news = products.filter((p) => p.is_new).slice(0, 4);

  return (
    <div>
      <section className="bg-secondary relative overflow-hidden">
        <img
          src={heroImg}
          alt="Atleta treinando com halteres em academia"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover opacity-60"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32">
          <p className="text-primary text-sm font-bold tracking-[0.2em] uppercase">
            Desde 1987 · Nutrição esportiva
          </p>
          <h1 className="text-secondary-foreground mt-4 max-w-2xl text-5xl font-bold uppercase sm:text-7xl">
            Combustível para <span className="text-primary">quem não para</span>
          </h1>
          <p className="text-secondary-foreground/80 mt-5 max-w-xl text-lg">
            Suplementos formulados com ciência e testados por atletas. Mais força, mais foco, mais
            resultado.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="font-bold uppercase">
              <Link to="/produtos" search={{ categoria: undefined, busca: undefined }}>
                Comprar agora
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-secondary-foreground border-secondary-foreground/40 bg-transparent font-bold uppercase"
            >
              <Link to="/produtos" search={{ categoria: "proteinas", busca: undefined }}>
                Ver proteínas
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-border border-b">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: "Frete grátis", text: "Nas compras acima de R$ 250" },
            { icon: CreditCard, title: "Até 12x sem juros", text: "No cartão de crédito" },
            { icon: ShieldCheck, title: "Produto original", text: "Direto da fábrica" },
            { icon: Headphones, title: "Atendimento", text: "Seg a sex, 8h às 18h" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <f.icon className="text-primary size-8 shrink-0" />
              <div>
                <p className="text-sm font-bold uppercase">{f.title}</p>
                <p className="text-muted-foreground text-xs">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-3xl font-bold uppercase">Categorias</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/produtos"
              search={{ categoria: c.slug, busca: undefined }}
              className="bg-secondary text-secondary-foreground hover:text-primary flex h-24 items-center justify-center rounded-md px-3 text-center text-sm font-bold uppercase transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold uppercase">Mais vendidos</h2>
          <Link
            to="/produtos"
            search={{ categoria: undefined, busca: undefined }}
            className="text-sm font-semibold underline"
          >
            Ver todos
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {news.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14">
          <h2 className="text-3xl font-bold uppercase">Lançamentos</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {news.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
