import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";

import { categoriesQuery, productsQuery } from "@/lib/catalog.functions";
import { categoryImage } from "@/lib/product-images";
import { ProductCard } from "@/components/ProductCard";

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
      {/* Banner principal — mesma proporção do original (1280x440 ≈ 2.9:1) */}
      <section className="relative overflow-hidden bg-[#c30000]">
        <img
          src={heroImg}
          alt="Atleta fitness em campanha Compre e Ganhe da Integralmédica"
          width={1920}
          height={660}
          className="aspect-[64/22] max-h-[520px] w-full object-cover"
        />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full w-full max-w-[1600px] items-center px-[3.5%]">
            <div className="max-w-[42%]">
              <h1 className="font-display text-[clamp(28px,4.3vw,66px)] leading-[0.9] font-bold text-white uppercase italic drop-shadow-lg">
                Compre e ganhe
                <br />
                um brinde
                <br />
                exclusivo
              </h1>
              <Link
                to="/produtos"
                search={{ categoria: undefined, busca: undefined }}
                className="font-display mt-[3%] inline-flex h-[clamp(30px,2.9vw,44px)] items-center justify-center bg-white px-[clamp(18px,3.4vw,52px)] text-[clamp(12px,1.4vw,20px)] font-bold tracking-wide text-[#c30000] uppercase italic transition-colors hover:bg-white/90"
              >
                Confira
              </Link>
              <p className="font-display mt-[4%] max-w-[62%] text-[clamp(7px,0.72vw,11px)] leading-snug font-semibold text-white/90 uppercase">
                *Brindes válidos enquanto durarem os estoques.
                <br />
                Não cumulativos com outras promoções.
                <br />
                Consulte as condições no site.
              </p>
            </div>

            <div className="ml-auto hidden h-[76%] gap-[1.5vw] lg:flex">
              {[
                { valor: "R$369", nome: "Camiseta" },
                { valor: "R$459", nome: "Mixer Pro" },
              ].map((b) => (
                <div
                  key={b.nome}
                  className="flex aspect-[185/330] h-full flex-col items-center justify-between rounded-[3px] border-2 border-[#ff2a2a] bg-black/25 px-[4%] py-[5%] shadow-[0_0_18px_rgba(255,40,40,0.85),inset_0_0_18px_rgba(255,40,40,0.6)]"
                >
                  <div className="text-center">
                    <p className="font-display text-[clamp(10px,1.15vw,18px)] font-bold text-white uppercase italic">
                      Acima de
                    </p>
                    <p className="font-display text-[clamp(16px,2.2vw,34px)] leading-tight font-bold text-white uppercase italic">
                      {b.valor}
                    </p>
                  </div>
                  <p className="font-display text-[clamp(11px,1.3vw,20px)] font-bold text-white uppercase italic">
                    {b.nome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tarja de cupom */}
      <div className="bg-secondary py-3 text-center text-[15px] font-bold text-white">
        Cupom - <span className="text-primary">CREAT30</span> Ganhe{" "}
        <span className="text-primary">30%off</span> na 2ª uni de{" "}
        <span className="text-primary">Creatinas</span>
      </div>

      {/* Benefícios */}
      <section className="bg-muted/60">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
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
        <h2 className="text-center text-[28px] font-bold italic">Busque por categoria</h2>
        <div className="mt-10 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/produtos"
              search={{ categoria: c.slug, busca: undefined }}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <span className="bg-primary flex size-[92px] items-center justify-center overflow-hidden rounded-full transition-transform group-hover:scale-105">
                <img
                  src={categoryImage(c.slug)}
                  alt={c.name}
                  loading="lazy"
                  className="size-[74px] object-contain mix-blend-multiply"
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
