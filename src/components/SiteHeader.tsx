import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Menu, Search, ShoppingCart, User as UserIcon, X } from "lucide-react";

import { categoriesQuery } from "@/lib/catalog.functions";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <div className="bg-primary py-1.5 text-center text-[11px] font-semibold tracking-wide text-primary-foreground uppercase">
        Frete grátis acima de R$ 250 · Até 12x sem juros
      </div>

      <div className="bg-secondary text-secondary-foreground">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <button
            className="lg:hidden"
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          <Link to="/" className="font-display text-2xl leading-none font-bold tracking-tight">
            INTEGRAL<span className="text-primary">MÉDICA</span>
          </Link>

          <form onSubmit={submitSearch} className="ml-auto hidden max-w-md flex-1 md:flex">
            <div className="relative w-full">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Buscar suplementos..."
                className="bg-background text-foreground pl-9"
                aria-label="Buscar produtos"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hover:bg-secondary-foreground/10 text-secondary-foreground"
            >
              <Link to={user ? "/conta" : "/auth"} className="flex items-center gap-2">
                <UserIcon className="size-5" />
                <span className="hidden text-xs sm:inline">
                  {user ? "Minha conta" : "Entrar"}
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hover:bg-secondary-foreground/10 text-secondary-foreground relative"
            >
              <Link to="/carrinho" aria-label="Carrinho">
                <ShoppingCart className="size-5" />
                {count > 0 && (
                  <span className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-bold">
                    {count}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>

        <nav className="border-secondary-foreground/10 hidden border-t lg:block">
          <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-2.5 text-sm font-semibold tracking-wide uppercase">
            <Link
              to="/produtos"
              search={{ categoria: undefined, busca: undefined }}
              className="hover:text-primary transition-colors"
            >
              Todos
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
          <div className="border-secondary-foreground/10 space-y-1 border-t px-4 py-3 lg:hidden">
            <form onSubmit={submitSearch} className="mb-3">
              <Input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Buscar suplementos..."
                className="bg-background text-foreground"
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
