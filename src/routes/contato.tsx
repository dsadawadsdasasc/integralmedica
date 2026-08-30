import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Fale conosco | Integralmédica" },
      {
        name: "description",
        content:
          "Entre em contato com o atendimento Integralmédica: dúvidas sobre pedidos, produtos e trocas.",
      },
      { property: "og:title", content: "Fale conosco | Integralmédica" },
      { property: "og:description", content: "Atendimento de segunda a sexta, das 8h às 18h." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-4xl font-bold uppercase">Fale conosco</h1>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSending(true);
            setTimeout(() => {
              setSending(false);
              (e.target as HTMLFormElement).reset();
              toast.success("Mensagem enviada! Responderemos em até 24h.");
            }, 600);
          }}
        >
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="msg">Mensagem</Label>
            <Textarea id="msg" required rows={5} className="mt-1" />
          </div>
          <Button type="submit" disabled={sending} className="font-bold uppercase">
            {sending ? "Enviando..." : "Enviar mensagem"}
          </Button>
        </form>

        <div className="space-y-4 text-sm">
          <p className="flex items-center gap-3">
            <Phone className="text-primary size-5" /> 0800 000 0000
          </p>
          <p className="flex items-center gap-3">
            <Mail className="text-primary size-5" /> sac@integralmedica.com.br
          </p>
          <p className="flex items-center gap-3">
            <MapPin className="text-primary size-5" /> Embu-Guaçu, São Paulo — Brasil
          </p>
          <div className="bg-muted rounded-md p-4">
            <p className="font-semibold">Horário de atendimento</p>
            <p className="text-muted-foreground">Segunda a sexta, das 8h às 18h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
