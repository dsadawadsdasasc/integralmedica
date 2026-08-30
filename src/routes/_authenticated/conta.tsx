import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getMyProfile, listMyOrders, updateMyProfile } from "@/lib/orders.functions";
import { formatBRL } from "@/lib/catalog-types";
import { productImage } from "@/lib/product-images";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta | Integralmédica" },
      { name: "description", content: "Acompanhe seus pedidos e atualize seus dados cadastrais." },
      { property: "og:title", content: "Minha conta | Integralmédica" },
      { property: "og:description", content: "Acompanhe seus pedidos Integralmédica." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const fetchOrders = useServerFn(listMyOrders);
  const fetchProfile = useServerFn(getMyProfile);
  const saveProfile = useServerFn(updateMyProfile);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const orders = useQuery({ queryKey: ["my-orders"], queryFn: () => fetchOrders() });
  const profile = useQuery({ queryKey: ["my-profile"], queryFn: () => fetchProfile() });

  const [form, setForm] = useState({ full_name: "", phone: "", cpf: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile.data) {
      setForm({
        full_name: profile.data.full_name,
        phone: profile.data.phone,
        cpf: profile.data.cpf,
      });
    }
  }, [profile.data]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold uppercase">Minha conta</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Sair
        </Button>
      </div>

      <Tabs defaultValue="pedidos" className="mt-8">
        <TabsList>
          <TabsTrigger value="pedidos">Meus pedidos</TabsTrigger>
          <TabsTrigger value="dados">Meus dados</TabsTrigger>
        </TabsList>

        <TabsContent value="pedidos" className="mt-6 space-y-4">
          {orders.isLoading && <p className="text-muted-foreground">Carregando pedidos...</p>}
          {orders.data?.length === 0 && (
            <div className="border-border rounded-md border p-8 text-center">
              <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
              <Button asChild className="mt-4 font-bold uppercase">
                <Link to="/produtos" search={{ categoria: undefined, busca: undefined }}>
                  Começar a comprar
                </Link>
              </Button>
            </div>
          )}
          {orders.data?.map((order) => (
            <article key={order.id} className="border-border rounded-md border p-5">
              <header className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold">Pedido #{order.order_number}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(order.created_at).toLocaleDateString("pt-BR")} ·{" "}
                    {order.payment_method.toUpperCase()}
                  </p>
                </div>
                <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-bold uppercase">
                  {order.status}
                </span>
              </header>
              <ul className="mt-4 space-y-3">
                {order.order_items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 text-sm">
                    <img
                      src={productImage(item.image_key)}
                      alt={item.product_name}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="bg-muted size-12 rounded object-cover"
                    />
                    <span className="flex-1">
                      {item.quantity}x {item.product_name}
                      {item.flavor ? ` · ${item.flavor}` : ""}
                    </span>
                    <span>{formatBRL(item.unit_price_cents * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <p className="border-border mt-4 border-t pt-3 text-right font-bold">
                Total: {formatBRL(order.total_cents)}
              </p>
            </article>
          ))}
        </TabsContent>

        <TabsContent value="dados" className="mt-6">
          <form
            className="max-w-md space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              try {
                await saveProfile({ data: form });
                toast.success("Dados atualizados!");
                queryClient.invalidateQueries({ queryKey: ["my-profile"] });
              } catch {
                toast.error("Não foi possível salvar seus dados.");
              } finally {
                setSaving(false);
              }
            }}
          >
            <div>
              <Label htmlFor="full_name">Nome completo</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={form.cpf}
                onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={saving} className="font-bold uppercase">
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
