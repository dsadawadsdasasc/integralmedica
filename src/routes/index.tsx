import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";

import { categoriesQuery, productsQuery } from "@/lib/catalog.functions";
import { categoryBackground, categoryImage } from "@/lib/product-images";
import { ProductCard } from "@/components/ProductCard";

import heroImg from "@/assets/official/hero.jpg";

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
      <section className="relative overflow-hidden bg-primary">
        <img
          src={heroImg}
          alt="Compre e ganhe um brinde exclusivo Integralmédica"
          width={2560}
          height={890}
          className="aspect-[2560/890] w-full object-cover"
        />
        <button aria-label="Banner anterior" className="bg-secondary/80 text-secondary-foreground absolute top-1/2 left-3 hidden size-8 -translate-y-1/2 items-center justify-center text-2xl md:flex">‹</button>
        <button aria-label="Próximo banner" className="bg-secondary/80 text-secondary-foreground absolute top-1/2 right-3 hidden size-8 -translate-y-1/2 items-center justify-center text-2xl md:flex">›</button>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1">
          <span className="bg-background h-[3px] w-20" /><span className="bg-background/70 h-[3px] w-6" /><span className="bg-background/70 h-[3px] w-6" />
        </div>
      </section>

      {/* Tarja de cupom */}
      <div className="bg-secondary text-secondary-foreground py-2 text-center text-[12px] font-bold">
        Cupom - <span className="text-primary">CREAT30</span> Ganhe{" "}
        <span className="text-primary">30%off</span> na 2ª uni de{" "}
        <span className="text-primary">Creatinas</span>
      </div>

      {/* Benefícios */}
      <section className="bg-muted/60">
        <div className="mx-auto grid max-w-[980px] gap-6 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Produtos Direto da Fábrica", text: "Qualidade, Lote Rastreável" },
            { icon: Truck, title: "Frete grátis p/ todo Brasil", text: "Em compras acima de R$280,00" },
            { icon: Headphones, title: "Cashback Integral Club", text: "Participe dos objetivos e ganhe!" },
            { icon: CreditCard, title: "Pague com Pix, e Ganhe 5% Off", text: "Consulte as condições" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <f.icon className="text-foreground size-8 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-[15px] font-bold italic">{f.title}</p>
                <p className="text-muted-foreground text-[13px]">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-[1280px] px-4 py-14">
        <h2 className="text-center text-[25px] font-bold italic">Busque por categoria</h2>
        <div className="mt-9 flex flex-wrap items-start justify-center gap-x-9 gap-y-8">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/produtos"
              search={{ categoria: c.slug, busca: undefined }}
              className="group flex w-[112px] flex-col items-center gap-3 text-center"
            >
              <span className="relative flex size-[112px] items-center justify-center transition-transform group-hover:scale-105">
                <img src={categoryBackground} alt="" className="absolute inset-0 size-full" />
                <img
                  src={categoryImage(c.slug)}
                  alt={c.name}
                  loading="lazy"
                  className="relative size-[72px] object-contain"
                />
              </span>
              <span className="text-primary text-[13px] leading-tight font-bold uppercase">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-14">
        <h2 className="text-center text-[28px] font-bold italic">Suplementos Mais Vendidos</h2>
        <div className="mt-2 text-center">
          <Link
            to="/produtos"
            search={{ categoria: undefined, busca: undefined }}
            className="text-primary text-sm font-semibold underline"
          >
            Ver todos
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {news.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-4 pb-14">
          <h2 className="text-center text-[28px] font-bold italic">Lançamentos</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {news.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
