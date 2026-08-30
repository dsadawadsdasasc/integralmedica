import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Integralmédica | Nutrição esportiva desde 1987" },
      {
        name: "description",
        content:
          "Conheça a história da Integralmédica: pesquisa, tecnologia e qualidade em suplementos esportivos há mais de três décadas.",
      },
      { property: "og:title", content: "Sobre a Integralmédica" },
      {
        property: "og:description",
        content: "Pesquisa, tecnologia e qualidade em nutrição esportiva desde 1987.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-4xl font-bold uppercase">Sobre a marca</h1>
      <p className="text-muted-foreground mt-6 leading-relaxed">
        Nascida em 1987, a Integralmédica se tornou referência em nutrição esportiva no Brasil,
        unindo pesquisa científica, tecnologia de produção e obsessão por qualidade. Cada produto
        passa por rigorosos controles laboratoriais antes de chegar até você.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { n: "35+", t: "anos de mercado" },
          { n: "200+", t: "produtos desenvolvidos" },
          { n: "1M+", t: "atletas atendidos" },
        ].map((s) => (
          <div key={s.t} className="bg-secondary text-secondary-foreground rounded-md p-6">
            <p className="text-primary text-4xl font-bold">{s.n}</p>
            <p className="mt-1 text-sm uppercase">{s.t}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-12 text-2xl font-bold uppercase">Nosso compromisso</h2>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        Fórmulas transparentes, matérias-primas rastreadas e resultados comprovados. Trabalhamos
        para que cada dose entregue exatamente o que promete no rótulo — sem atalhos.
      </p>
      <p className="text-muted-foreground mt-8 text-xs">
        Este site é um clone demonstrativo criado para fins de estudo e não possui vínculo oficial
        com a marca.
      </p>
    </div>
  );
}
