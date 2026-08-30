import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Truck, ShieldCheck, CreditCard, Headphones, ChevronLeft, ChevronRight } from "lucide-react";

import { categoriesQuery, productsQuery } from "@/lib/catalog.functions";
import { categoryBackground, categoryImage } from "@/lib/product-images";
import { ProductCard } from "@/components/ProductCard";
import {
  BlogSection,
  FaqSection,
  IntegralTvSection,
  NewsletterSection,
  SocialSection,
  SportsSection,
} from "@/components/HomeExtras";


import b1 from "@/assets/official/banners/b1-brindes.jpg";
import b2 from "@/assets/official/banners/b2-olympia.png";
import b3 from "@/assets/official/banners/b3-creatinas.jpg";
import b4 from "@/assets/official/banners/b4-primemd.png";
import b5 from "@/assets/official/banners/b5-unitarios.png";
import b6 from "@/assets/official/banners/b6-moda.jpg";

const BANNERS = [
  { src: b1, alt: "Compre e ganhe um brinde exclusivo Integralmedica" },
  { src: b2, alt: "Olympia 2026 Integralmedica" },
  { src: b3, alt: "Linha de creatinas Integralmedica" },
  { src: b4, alt: "Pré-Treino Prime MD" },
  { src: b5, alt: "Produtos unitários Integralmedica" },
  { src: b6, alt: "Lançamento coleção de moda Integralmedica" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Integralmedica | Suplementos, Whey Protein e Creatina Oficiais" },
      {
        name: "description",
        content:
          "Loja oficial Integralmedica: creatina, whey protein, pré-treino, barras e acessórios. Frete grátis acima de R$ 280 e 5% off no Pix.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Integralmedica | Suplementos de Alta Performance" },
      {
        property: "og:description",
        content: "Creatina, whey protein, pré-treino e muito mais com entrega para todo o Brasil.",
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
  const [featuredCategory, setFeaturedCategory] = useState("creatina");
  const selectedCategory = categories.find((category) => category.slug === featuredCategory);
  const featured = products
    .filter((product) => !selectedCategory || product.category_id === selectedCategory.id)
    .slice(0, 4);
  const news = products.filter((p) => p.is_new).slice(0, 8);
  const apparelIds = categories
    .filter((c) => c.slug === "vestuario" || c.slug === "acessorios")
    .map((c) => c.id);
  const apparel = products.filter((p) => apparelIds.includes(p.category_id)).slice(0, 4);


  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % BANNERS.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {/* Carrossel principal */}
      <section className="bg-secondary relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {BANNERS.map((b, i) => (
            <img
              key={b.src}
              src={b.src}
              alt={b.alt}
              width={2560}
              height={890}
              loading={i === 0 ? "eager" : "lazy"}
              className="aspect-[2560/890] w-full shrink-0 object-cover"
            />
          ))}
        </div>
        <button
          aria-label="Slide anterior"
          onClick={() => setSlide((s) => (s - 1 + BANNERS.length) % BANNERS.length)}
          className="bg-secondary/70 text-secondary-foreground absolute top-1/2 left-3 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full md:flex"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          aria-label="Próximo slide"
          onClick={() => setSlide((s) => (s + 1) % BANNERS.length)}
          className="bg-secondary/70 text-secondary-foreground absolute top-1/2 right-3 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full md:flex"
        >
          <ChevronRight className="size-5" />
        </button>
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
          {BANNERS.map((b, i) => (
            <button
              key={b.src}
              aria-label={`Ir para o slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-[3px] transition-all ${i === slide ? "bg-background w-16" : "bg-background/60 w-6"}`}
            />
          ))}
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
        <div className="mx-auto grid max-w-[1100px] gap-6 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
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
      <section className="mx-auto max-w-[1024px] px-4 py-10">
        <h2 className="text-center text-[25px] font-bold italic">Busque por categoria</h2>
        <div className="mt-8 grid grid-cols-4 gap-x-5 gap-y-8 md:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/produtos"
              search={{ categoria: c.slug, busca: undefined }}
              className="group flex min-w-0 flex-col items-center gap-3 text-center"
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

      {/* Mais vendidos */}
      <section className="mx-auto max-w-[1024px] px-4 pb-14 pt-4">
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
        <div className="mt-6 hidden items-center justify-center gap-1 overflow-x-auto md:flex">
          {categories.slice(0, 6).map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setFeaturedCategory(category.slug)}
              className={`relative shrink-0 px-4 py-2 text-[12px] font-bold uppercase ${
                featuredCategory === category.slug ? "bg-primary text-primary-foreground" : "text-foreground"
              }`}
            >
              {category.name}
              {featuredCategory === category.slug && (
                <span className="border-background border-t-primary absolute -bottom-2 left-1/2 -translate-x-1/2 border-x-[8px] border-t-[8px] border-x-transparent" />
              )}
            </button>
          ))}
        </div>
        <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Texto institucional */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-[1000px] space-y-4 px-4 py-14 text-center">
          <h2 className="text-[26px] font-bold italic">Suplementos Integralmedica</h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            Na Integralmedica, você encontra uma <strong>linha completa de suplementos para elevar sua performance e
            te fazer alcançar seus objetivos.</strong> São opções de whey protein, creatina, BCAA, pré-treino e muito
            mais, desenvolvidas para quem busca resultados reais, seja na hipertrofia, na definição ou na melhora da
            saúde e disposição.
          </p>
          <Link
            to="/produtos"
            search={{ categoria: "whey-protein", busca: undefined }}
            className="bg-primary text-primary-foreground inline-block rounded-sm px-8 py-3 text-sm font-bold uppercase"
          >
            Ver suplementos
          </Link>
        </div>
      </section>

      {/* Lançamentos */}
      {news.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-4 py-14">
          <h2 className="text-center text-[28px] font-bold italic">Lançamentos Integralmedica</h2>
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
            {news.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sobre nós */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1000px] space-y-4 px-4 py-14">
          <h2 className="text-center text-[26px] font-bold italic">Sobre Nós</h2>
          <p className="text-[15px] leading-relaxed opacity-90">
            Com mais de 40 anos de história, somos pioneiros em suplementação esportiva no Brasil e, desde o primeiro
            momento, imprimimos uma marca de inovação e excelência em produção e pesquisa. Hoje contamos com mais de
            620 pessoas apaixonadas por suplementação, que trabalham diariamente para trazer ao consumidor a vanguarda
            em nutrição esportiva.
          </p>
          <p className="text-[15px] leading-relaxed opacity-90">
            A constante busca por inovação e promoção de saúde nos levou a criar marcas que encantam e ensinam.
            Atualmente, o Grupo BRG contempla as marcas Integralmedica, Darkness e Nutrify.
          </p>
          <div className="text-center">
            <Link to="/sobre" className="text-primary text-sm font-bold uppercase underline">
              Conheça mais
            </Link>
          </div>
        </div>
      </section>

      {/* Texto de performance */}
      <section className="mx-auto max-w-[1000px] space-y-4 px-4 py-14 text-center">
        <h2 className="text-[22px] font-bold italic">
          Potencialize a performance dos seus treinos com os melhores suplementos
        </h2>
        <p className="text-muted-foreground text-[15px] leading-relaxed">
          Os suplementos Integralmedica são aliados indispensáveis para quem busca elevar o nível nos treinos e
          conquistar resultados sólidos. Aqui você encontra desde o clássico whey protein concentrado, isolado ou
          hidrolisado até a potente creatina para aumento de força, resistência e volume muscular.
        </p>
        <Link
          to="/produtos"
          search={{ categoria: undefined, busca: undefined }}
          className="bg-primary text-primary-foreground inline-block rounded-sm px-8 py-3 text-sm font-bold uppercase"
        >
          Ver suplementos
        </Link>
      </section>

      <SportsSection />

      {/* Roupas e Acessórios */}
      {apparel.length > 0 && (
        <section className="mx-auto max-w-[1024px] px-4 py-12">
          <h2 className="text-center text-[26px] font-bold italic">Roupas e Acessórios</h2>
          <div className="mt-2 text-center">
            <Link
              to="/produtos"
              search={{ categoria: "vestuario", busca: undefined }}
              className="text-primary text-sm font-semibold underline"
            >
              Ver tudo em Roupas
            </Link>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {apparel.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <IntegralTvSection />
      <BlogSection />
      <SocialSection />
      <FaqSection />
      <NewsletterSection />
    </div>
  );
}

