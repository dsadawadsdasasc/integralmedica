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
      {/* Banner principal */}
      <section className="relative overflow-hidden bg-[#c30000]">
        <img
          src={heroImg}
          alt="Atleta treinando com halteres em academia"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover opacity-35 mix-blend-luminosity"
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-20 sm:py-28">
          <h1 className="font-display max-w-3xl text-5xl leading-[0.95] font-bold text-white uppercase italic sm:text-7xl">
            Compre e ganhe
            <br />
            um brinde
            <br />
            exclusivo
          </h1>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-none bg-white px-10 text-base font-bold tracking-wide text-[#c30000] uppercase hover:bg-white/90"
            >
              <Link to="/produtos" search={{ categoria: undefined, busca: undefined }}>
                Confira
              </Link>
            </Button>
          </div>
          <p className="mt-10 max-w-md text-[11px] leading-relaxed text-white/80 uppercase">
            *Brindes válidos enquanto durarem os estoques. Não cumulativos com outras promoções.
            Consulte as condições no site.
          </p>
        </div>
      </section>

      {/* Tarja de cupom */}
      <div className="bg-secondary py-3 text-center text-sm font-bold text-white">
        Cupom - <span className="text-primary">CREAT30</span> Ganhe{" "}
        <span className="text-primary">30%off</span> na 2ª uni de{" "}
        <span className="text-primary">Creatinas</span>
      </div>

      {/* Benefícios */}
      <section className="bg-muted">
        <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Produtos Direto da Fábrica", text: "Qualidade, Lote Rastreável" },
            { icon: Truck, title: "Frete grátis p/ todo Brasil", text: "Em compras acima de R$ 280,00" },
            { icon: Headphones, title: "Cashback Integral Club", text: "Participe dos objetivos e ganhe!" },
            { icon: CreditCard, title: "Pague com Pix, e Ganhe 5% Off", text: "Consulte as condições" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <f.icon className="text-foreground size-8 shrink-0" />
              <div>
                <p className="text-sm font-bold italic">{f.title}</p>
                <p className="text-muted-foreground text-xs">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-[1400px] px-4 py-14">
        <h2 className="text-center text-3xl font-bold italic">Busque por categoria</h2>
        <div className="mt-8 grid grid-cols-3 gap-6 sm:grid-cols-4 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/produtos"
              search={{ categoria: c.slug, busca: undefined }}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <span className="bg-primary flex size-24 items-center justify-center rounded-full transition-transform group-hover:scale-105 sm:size-28">
                <img
                  src={categoryImage(c.slug)}
                  alt={c.name}
                  loading="lazy"
                  className="size-16 object-contain mix-blend-multiply sm:size-20"
                />
              </span>
              <span className="text-sm font-bold">{c.name}</span>
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
