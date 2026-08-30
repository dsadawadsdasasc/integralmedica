import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Menu, Search, ShoppingCart, Star, Truck, User as UserIcon, X } from "lucide-react";

import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/use-session";
import logo from "@/assets/official/logo.svg";
import darknessLogo from "@/assets/official/darkness.webp";

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
      <div className="bg-background text-foreground flex h-[29px] items-center justify-center text-[12px] font-bold">
        Seu Suplemento com <span className="text-primary">Segurança</span> e{" "}
        <span className="text-primary">Confiança</span>
      </div>

      {/* Barra principal */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="mx-auto flex h-[69px] max-w-[1000px] items-center gap-4 px-4 xl:max-w-[1000px]">
          <button className="lg:hidden" aria-label="Abrir menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          <Link to="/" className="shrink-0">
            <img src={logo} alt="Integralmedica" width={123} height={64} className="h-[47px] w-[91px] object-contain" />
          </Link>

          <form onSubmit={submitSearch} className="mx-5 hidden max-w-[362px] flex-1 md:flex">
            <div className="relative w-full">
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Busque por..."
                aria-label="Buscar produtos"
                className="text-foreground bg-background h-[37px] w-full rounded-[3px] border border-border px-4 pr-12 text-[12px] outline-none"
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

          <div className="ml-auto flex items-center gap-6">
            <img src={darknessLogo} alt="Darkness" className="hidden h-[49px] w-[46px] object-contain xl:block" />

            <div className="hidden items-center gap-2 xl:flex">
              <Truck className="size-7" strokeWidth={1.4} />
              <div className="text-[13px] leading-tight">
                <p className="font-semibold">Rastreio</p>
                <p className="text-secondary-foreground/80 underline">Acompanhe seu pedido</p>
              </div>
            </div>

            <Link to={user ? "/conta" : "/auth"} className="flex items-center gap-2" aria-label="Minha conta">
              <UserIcon className="size-7" strokeWidth={1.4} />
              <div className="hidden text-[13px] leading-tight sm:block">
                <p className="font-semibold">Bem vindo,</p>
                <p className="text-secondary-foreground/80 underline">{user ? "Minha conta" : "Acesse seu perfil"}</p>
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
        <nav className="bg-muted-foreground hidden lg:block">
          <div className="mx-auto flex h-[30px] max-w-[1000px] items-center justify-between px-4 text-[10px] font-medium uppercase">
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
              ) : item.to === "/sobre" ? (
                <Link
                  key={item.label}
                  to="/sobre"
                  className="hover:text-primary flex items-center gap-2 transition-colors"
                >
                  {item.label} {item.caret && <ChevronDown className="size-4" />}
                </Link>
              ) : (
                <Link
                  key={item.label}
                  to="/produtos"
                  search={{ categoria: undefined, busca: undefined }}
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
