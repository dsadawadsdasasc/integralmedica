import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Menu, Search, ShoppingCart, Truck, User as UserIcon, X } from "lucide-react";

import { categoriesQuery } from "@/lib/catalog.functions";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/use-session";

export function SiteHeader() {
  const { data: categories = [] } = useQuery(categoriesQuery);
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
      <div className="bg-background text-foreground py-2 text-center text-[13px] font-semibold">
        Seu Suplemento com <span className="text-primary">Segurança</span> e{" "}
        <span className="text-primary">Confiança</span>
      </div>

      {/* Barra principal */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-4 px-4">
          <button className="lg:hidden" aria-label="Abrir menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          <Link to="/" className="shrink-0">
            <span className="font-display text-xl leading-none font-bold tracking-tight uppercase italic sm:text-2xl">
              Integral<span className="text-primary">medica</span>
            </span>
          </Link>

          <form onSubmit={submitSearch} className="mx-4 hidden max-w-[520px] flex-1 md:flex">
            <div className="relative w-full">
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Busque por..."
                aria-label="Buscar produtos"
                className="text-foreground h-10 w-full rounded-md bg-white px-4 pr-11 text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                <Search className="size-5" />
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-5">
            <div className="hidden items-center gap-2 xl:flex">
              <Truck className="size-6" />
              <div className="text-xs leading-tight">
                <p className="font-semibold">Rastreio</p>
                <p className="text-secondary-foreground/70 underline">Acompanhe seu pedido</p>
              </div>
            </div>

            <Link
              to={user ? "/conta" : "/auth"}
              className="flex items-center gap-2"
              aria-label="Minha conta"
            >
              <UserIcon className="size-6" />
              <div className="hidden text-xs leading-tight sm:block">
                <p className="font-semibold">Bem vindo,</p>
                <p className="text-secondary-foreground/70 underline">
                  {user ? "Minha conta" : "Acesse seu perfil"}
                </p>
              </div>
            </Link>

            <Link to="/carrinho" aria-label="Carrinho" className="relative">
              <ShoppingCart className="size-6" />
              <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-md text-[11px] font-bold">
                {count}
              </span>
            </Link>
          </div>
        </div>

        {/* Menu de categorias */}
        <nav className="hidden border-t border-white/10 bg-[#2b2b2b] lg:block">
          <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-9 px-4 py-3 text-[13px] font-semibold tracking-wide uppercase">
            <Link
              to="/produtos"
              search={{ categoria: undefined, busca: undefined }}
              className="hover:text-primary flex items-center gap-2 transition-colors"
            >
              <Menu className="size-4" /> Produtos
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/produtos"
                search={{ categoria: c.slug, busca: undefined }}
                className="hover:text-primary transition-colors"
              >
                {c.name}
              </Link>
            ))}
            <Link to="/sobre" className="hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link to="/contato" className="hover:text-primary transition-colors">
              Contato
            </Link>
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
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/produtos"
                search={{ categoria: c.slug, busca: undefined }}
                onClick={() => setOpen(false)}
                className="block py-1.5 text-sm font-semibold uppercase"
              >
                {c.name}
              </Link>
            ))}
            <Link
              to="/sobre"
              onClick={() => setOpen(false)}
              className="block py-1.5 text-sm font-semibold uppercase"
            >
              Sobre
            </Link>
            <Link
              to="/contato"
              onClick={() => setOpen(false)}
              className="block py-1.5 text-sm font-semibold uppercase"
            >
              Contato
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
