import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Menu, Search, ShoppingCart, Star, Truck, User as UserIcon, X } from "lucide-react";

import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/use-session";
import logo from "@/assets/logo.png";

const NAV: { label: string; slug?: string; to?: string; caret?: boolean }[] = [
  { label: "Produtos", caret: true },
  { label: "Creatina", slug: "creatinas" },
  { label: "Proteínas", slug: "proteinas" },
  { label: "Barra de Proteína", slug: "barras-snacks" },
  { label: "Hipercalórico", slug: "hipercaloricos" },
  { label: "Pré Treino", slug: "pre-treinos" },
  { label: "Central de Promoções", to: "/produtos" },
  { label: "Objetivos", caret: true, to: "/sobre" },
];

export function SiteHeader() {
  const { count } = useCart();
  const { user } = useSession();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/produtos", search: { busca: term || undefined, categoria: undefined } });
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Tarja superior */}
      <div className="bg-background text-foreground py-2 text-center text-[13px] font-bold">
        Seu Suplemento com <span className="text-primary">Segurança</span> e{" "}
        <span className="text-primary">Confiança</span>
      </div>

      {/* Barra principal */}
      <div className="bg-[#231f20] text-white">
        <div className="mx-auto flex h-[74px] max-w-[1600px] items-center gap-4 px-4">
          <button className="lg:hidden" aria-label="Abrir menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          <Link to="/" className="shrink-0">
            <img src={logo} alt="Integralmedica" width={248} height={64} className="h-11 w-auto" />
          </Link>

          <form onSubmit={submitSearch} className="mx-6 hidden max-w-[500px] flex-1 md:flex">
            <div className="relative w-full">
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Busque por..."
                aria-label="Buscar produtos"
                className="text-foreground h-11 w-full rounded-md border border-white/20 bg-white px-4 pr-12 text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="text-foreground absolute top-1/2 right-4 -translate-y-1/2"
              >
                <Search className="size-5" />
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-7">
            <span className="font-display hidden text-lg leading-none font-bold tracking-widest uppercase xl:block">
              Darkness
            </span>

            <div className="hidden items-center gap-2 xl:flex">
              <Truck className="size-7" strokeWidth={1.4} />
              <div className="text-[13px] leading-tight">
                <p className="font-semibold">Rastreio</p>
                <p className="text-white/80 underline">Acompanhe seu pedido</p>
              </div>
            </div>

            <Link to={user ? "/conta" : "/auth"} className="flex items-center gap-2" aria-label="Minha conta">
              <UserIcon className="size-7" strokeWidth={1.4} />
              <div className="hidden text-[13px] leading-tight sm:block">
                <p className="font-semibold">Bem vindo,</p>
                <p className="text-white/80 underline">{user ? "Minha conta" : "Acesse seu perfil"}</p>
              </div>
            </Link>

            <Link to="/conta" aria-label="Favoritos" className="hidden lg:block">
              <Star className="size-7" strokeWidth={1.4} />
            </Link>

            <Link to="/carrinho" aria-label="Carrinho" className="relative">
              <ShoppingCart className="size-7" strokeWidth={1.4} />
              <span className="bg-primary text-primary-foreground absolute -top-2.5 -right-3 flex size-5 items-center justify-center rounded-[3px] text-[11px] font-bold">
                {count}
              </span>
            </Link>
          </div>
        </div>

        {/* Menu de categorias */}
        <nav className="hidden bg-[#3d3a3b] lg:block">
          <div className="mx-auto flex max-w-[1600px] items-center justify-center gap-10 px-4 py-3.5 text-[13px] font-semibold tracking-wide uppercase">
            {NAV.map((item) =>
              item.slug ? (
                <Link
                  key={item.label}
                  to="/produtos"
                  search={{ categoria: item.slug, busca: undefined }}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : item.label === "Produtos" ? (
                <Link
                  key={item.label}
                  to="/produtos"
                  search={{ categoria: undefined, busca: undefined }}
                  className="hover:text-primary flex items-center gap-2 transition-colors"
                >
                  <Menu className="size-4" /> {item.label} <ChevronDown className="size-4" />
                </Link>
              ) : (
                <Link
                  key={item.label}
                  to={item.to === "/sobre" ? "/sobre" : "/produtos"}
                  search={item.to === "/sobre" ? undefined : { categoria: undefined, busca: undefined }}
                  className="hover:text-primary flex items-center gap-2 transition-colors"
                >
                  {item.label} {item.caret && <ChevronDown className="size-4" />}
                </Link>
              ),
            )}
          </div>
        </nav>

        {open && (
          <div className="space-y-1 border-t border-white/10 px-4 py-3 lg:hidden">
            <form onSubmit={submitSearch} className="mb-3">
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Busque por..."
                className="text-foreground h-10 w-full rounded-md bg-white px-4 text-sm outline-none"
              />
            </form>
            {NAV.filter((n) => n.slug).map((c) => (
              <Link
                key={c.label}
                to="/produtos"
                search={{ categoria: c.slug, busca: undefined }}
                onClick={() => setOpen(false)}
                className="block py-1.5 text-sm font-semibold uppercase"
              >
                {c.label}
              </Link>
            ))}
            <Link to="/sobre" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-semibold uppercase">
              Sobre
            </Link>
            <Link to="/contato" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-semibold uppercase">
              Contato
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
