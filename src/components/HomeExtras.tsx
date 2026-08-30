import { useState } from "react";

import tvLogo from "@/assets/official/integral-tv-logo.webp";
import sportFisic from "@/assets/official/sports/fisiculturismo.png";
import sportSurf from "@/assets/official/sports/surf.png";
import sportBoxe from "@/assets/official/sports/boxe.png";
import sportMma from "@/assets/official/sports/mma.png";
import icFisic from "@/assets/official/sports/ic-fisiculturismo.svg";
import icSurf from "@/assets/official/sports/ic-surf.png";
import icBoxe from "@/assets/official/sports/ic-boxe.svg";
import post1 from "@/assets/official/blog/post1.jpg";
import post2 from "@/assets/official/blog/post2.jpg";
import post3 from "@/assets/official/blog/post3.jpg";
import socInstagram from "@/assets/official/social/instagram.webp";
import socYoutube from "@/assets/official/social/youtube.webp";
import socTiktok from "@/assets/official/social/tiktok.webp";
import socFacebook from "@/assets/official/social/facebook.webp";

const SPORTS = [
  { name: "FISICULTURISMO", img: sportFisic, icon: icFisic },
  { name: "SURF", img: sportSurf, icon: icSurf },
  { name: "BOXE", img: sportBoxe, icon: icBoxe },
  { name: "MMA", img: sportMma, icon: icFisic },
];

export function SportsSection() {
  return (
    <section className="mx-auto max-w-[1024px] px-4 py-12">
      <h2 className="text-center text-[26px] font-bold italic">Busque por Atividade</h2>
      <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
        {SPORTS.map((s) => (
          <div key={s.name} className="flex flex-col items-center gap-3">
            <img
              src={s.img}
              alt={s.name}
              loading="lazy"
              className="border-primary size-[120px] rounded-full border-2 object-cover"
            />
            <span className="flex items-center gap-2 text-[13px] font-bold uppercase">
              <img src={s.icon} alt="" className="h-4 w-auto" />
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

const VIDEOS = [
  { id: "bQsNKQgePiY", title: "UMA MENINA DE 20 ANOS ASSUSTOU TODO MUNDO NO DESAFIO DO DORÃO!!!" },
  { id: "o374emXcfsA", title: "ARNOLD UK: DOMÍNIO TOTAL! Rayane IMBÁTIVEL, Vitinho CAMPEÃO e Andrew OUTRO NÍVEL!" },
  { id: "TTibgXGA-as", title: "TREINO COM O GUIZÃO ONDE ELE COMEÇOU E FIZEMOS UM CONVITE. ELE ACEITOU?" },
  { id: "9bZkp7q19f0", title: "MENEGATES ADOTAM UM NOVO VISUAL! QUEM FICOU MELHOR? LUCAS OU MATHEUS?" },
];

export function IntegralTvSection() {
  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-[1024px] px-4 py-14">
        <div className="flex justify-center">
          <img src={tvLogo} alt="IntegralTV" className="h-[46px] w-auto" />
        </div>
        <p className="mx-auto mt-4 max-w-[760px] text-center text-[14px] leading-relaxed opacity-90">
          Aqui nós reunimos os monstros da #DarknessNation e os superatletas do #IntegralTeam. Acompanhe a rotina e o
          dia a dia de nossos atletas, são conteúdos valiosos sobre Dietas e Dicas de Suplementação, Treinos, Diversão e
          muito mais!
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {VIDEOS.map((v) => (
            <article key={v.id} className="bg-background text-foreground overflow-hidden rounded-md">
              <img
                src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                alt={v.title}
                loading="lazy"
                className="aspect-video w-full object-cover"
              />
              <div className="flex flex-col gap-3 p-4">
                <h3 className="line-clamp-3 text-[13px] font-bold uppercase">{v.title}</h3>
                <a
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary text-[12px] font-bold uppercase"
                >
                  Assistir →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const POSTS = [
  {
    img: post1,
    title: "Massa muscular, Metabolismo e Hormônios: o que muda a partir dos 30 anos?",
    excerpt:
      "O processo de ganho de massa muscular é algo bem importante, pois ele pode deixar o nosso metabolismo acelerado. Porém o metabolismo depois dos 30 começa a sofrer alterações hormonais e graduais.",
    date: "18/03/2026",
  },
  {
    img: post2,
    title: "Após os 25, você começa a perder massa muscular? Entenda o que realmente acontece",
    excerpt:
      "A ideia de que começamos a perder massa muscular após os 25 anos é bastante difundida. Mas será que essa afirmação é realmente tão simples assim?",
    date: "19/03/2026",
  },
  {
    img: post3,
    title: "Treino após os 25: o que deve mudar (e o que NÃO deve)?",
    excerpt:
      "Treinar após os 25 anos é um dos melhores investimentos: o foco deve migrar para a consistência orientada, qualidade de movimento e recuperação.",
    date: "20/03/2026",
  },
];

export function BlogSection() {
  return (
    <section className="mx-auto max-w-[1024px] px-4 py-14">
      <h2 className="text-center text-[24px] font-bold italic">
        Blog Integralmedica: conteúdos de alta performance para seus treinos!
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {POSTS.map((p) => (
          <article key={p.title} className="border-border overflow-hidden rounded-md border">
            <img src={p.img} alt={p.title} loading="lazy" className="aspect-[1020/415] w-full object-cover" />
            <div className="space-y-3 p-4">
              <h3 className="text-[15px] leading-snug font-bold">{p.title}</h3>
              <p className="text-muted-foreground line-clamp-4 text-[13px]">{p.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[12px]">{p.date}</span>
                <span className="text-primary text-[12px] font-bold uppercase">Continuar lendo</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const SOCIAL = [
  { name: "Instagram", img: socInstagram, url: "https://www.instagram.com/integralmedica/" },
  { name: "Youtube", img: socYoutube, url: "https://www.youtube.com/@integralmedica" },
  { name: "TikTok", img: socTiktok, url: "https://www.tiktok.com/@integralmedica" },
  { name: "Facebook", img: socFacebook, url: "https://www.facebook.com/integralmedica" },
];

export function SocialSection() {
  return (
    <section className="bg-muted/50">
      <div className="mx-auto max-w-[1024px] px-4 py-12">
        <h2 className="text-center text-[20px] font-bold italic">
          Siga e acompanhe os conteúdos Integralmedica nas Redes Sociais
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {SOCIAL.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3">
              <img src={s.img} alt={s.name} loading="lazy" className="size-[104px] rounded-md object-cover" />
              <span className="text-[13px] font-bold uppercase">{s.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQ = [
  {
    q: "O que são suplementos alimentares?",
    a: "Os suplementos alimentares são produtos desenvolvidos para complementar a alimentação e fornecer nutrientes essenciais, como proteínas, aminoácidos, vitaminas e minerais. Eles são usados para otimizar o desempenho físico, melhorar a recuperação e auxiliar no alcance de objetivos como hipertrofia, emagrecimento ou melhora da saúde geral.",
  },
  {
    q: "Quais os principais suplementos disponíveis?",
    a: "Whey protein, creatina, hipercalóricos, barras de proteína, glutamina, BCAA e pré-treinos são os mais procurados por quem treina com regularidade.",
  },
  {
    q: "O que tomar para hipertrofia?",
    a: "A combinação mais eficiente costuma ser whey protein para atingir a meta diária de proteínas, creatina para força e volume muscular e, se necessário, hipercalórico para fechar o superávit calórico.",
  },
  {
    q: "Quais suplementos tomar no emagrecimento?",
    a: "Proteínas de alta qualidade ajudam na saciedade e na preservação da massa magra; termogênicos e cafeína podem apoiar o gasto energético sempre com orientação profissional.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-[860px] px-4 py-14">
      <h2 className="text-center text-[24px] font-bold italic">Dúvidas frequentes sobre suplementos</h2>
      <div className="mt-8 space-y-3">
        {FAQ.map((item, i) => (
          <div key={item.q} className="border-border border-b">
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center gap-4 py-4 text-left"
            >
              <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold">
                {i + 1}
              </span>
              <span className="text-[15px] font-bold">{item.q}</span>
            </button>
            {open === i && <p className="text-muted-foreground pb-5 pl-10 text-[14px] leading-relaxed">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="mx-auto flex max-w-[1024px] flex-col gap-6 px-4 py-12 md:flex-row md:items-center">
        <div className="md:w-1/3">
          <h2 className="text-primary text-[20px] font-bold italic uppercase">Receba nossa newsletter</h2>
          <p className="mt-2 text-[13px] opacity-80">
            Assine a nossa newsletter e receba as novidades e conteúdos exclusivos da Integralmedica
          </p>
        </div>
        <form
          className="flex flex-1 flex-col gap-3 md:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLFormElement).reset();
          }}
        >
          <input
            required
            placeholder="Seu nome"
            className="text-foreground h-11 flex-1 rounded-sm bg-white px-3 text-sm"
          />
          <input
            required
            type="email"
            placeholder="E-mail"
            className="text-foreground h-11 flex-1 rounded-sm bg-white px-3 text-sm"
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground h-11 rounded-sm px-8 text-sm font-bold uppercase"
          >
            Inscreva-se
          </button>
        </form>
      </div>
    </section>
  );
}
