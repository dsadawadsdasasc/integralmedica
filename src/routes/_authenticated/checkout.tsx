import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { createOrder } from "@/lib/orders.functions";
import { useCart, shippingFor } from "@/lib/cart";
import { formatBRL } from "@/lib/catalog-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Integralmédica" },
      { name: "description", content: "Finalize seu pedido com entrega para todo o Brasil." },
      { property: "og:title", content: "Checkout | Integralmédica" },
      { property: "og:description", content: "Finalize seu pedido com segurança." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const shipping = shippingFor(subtotal);
  const submit = useServerFn(createOrder);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState("pix");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    const form = new FormData(e.currentTarget);
    const value = (k: string) => String(form.get(k) ?? "");
    setLoading(true);
    try {
      const order = await submit({
        data: {
          items,
          shipping_cents: shipping,
          payment_method: payment,
          customer_name: value("nome"),
          email: value("email"),
          phone: value("telefone"),
          cep: value("cep"),
          address: value("endereco"),
          number: value("numero"),
          complement: value("complemento"),
          district: value("bairro"),
          city: value("cidade"),
          state: value("estado"),
        },
      });
      clear();
      toast.success(`Pedido ${order.order_number} confirmado!`);
      navigate({ to: "/conta" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao finalizar o pedido");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold uppercase">Carrinho vazio</h1>
        <Button asChild className="mt-6 font-bold uppercase">
          <Link to="/produtos" search={{ categoria: undefined, busca: undefined }}>
            Ver produtos
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-bold uppercase">Checkout</h1>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-bold uppercase">Dados pessoais</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" name="nome" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" name="cep" required className="mt-1" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase">Endereço de entrega</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" name="endereco" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" name="numero" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input id="complemento" name="complemento" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" name="bairro" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" name="cidade" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input id="estado" name="estado" required maxLength={2} className="mt-1" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase">Pagamento</h2>
            <div className="mt-4 space-y-2">
              {[
                { id: "pix", label: "PIX (5% de desconto na aprovação)" },
                { id: "cartao", label: "Cartão de crédito em até 12x sem juros" },
                { id: "boleto", label: "Boleto bancário" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${
                    payment === opt.id ? "border-primary bg-accent" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="pagamento"
                    value={opt.id}
                    checked={payment === opt.id}
                    onChange={() => setPayment(opt.id)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="border-border h-fit rounded-md border p-5">
          <h2 className="text-lg font-bold uppercase">Seu pedido</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={`${i.product_id}-${i.flavor}`} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {i.quantity}x {i.product_name}
                </span>
                <span>{formatBRL(i.unit_price_cents * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="border-border mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatBRL(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Frete</dt>
              <dd>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</dd>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <dt>Total</dt>
              <dd>{formatBRL(subtotal + shipping)}</dd>
            </div>
          </dl>
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="mt-5 w-full font-bold uppercase"
          >
            {loading ? "Processando..." : "Confirmar pedido"}
          </Button>
        </aside>
      </form>
    </div>
  );
}
