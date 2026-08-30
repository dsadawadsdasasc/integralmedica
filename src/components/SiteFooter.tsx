import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube } from "lucide-react";

import visa from "@/assets/official/pay/visa.svg";
import mastercard from "@/assets/official/pay/mastercard.svg";
import elo from "@/assets/official/pay/elo.svg";
import amex from "@/assets/official/pay/amex.svg";
import hipercard from "@/assets/official/pay/hipercard.svg";
import diners from "@/assets/official/pay/diners.png";
import pix from "@/assets/official/pay/pix.svg";
import googleSafe from "@/assets/official/google-safe.png";

const PAYMENTS = [
  { src: visa, alt: "Visa" },
  { src: mastercard, alt: "Mastercard" },
  { src: elo, alt: "Elo" },
  { src: amex, alt: "American Express" },
  { src: hipercard, alt: "Hipercard" },
  { src: diners, alt: "Diners Club" },
  { src: pix, alt: "Pix" },
];


export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold">
            INTEGRAL<span className="text-primary">MÉDICA</span>
          </p>
          <p className="text-secondary-foreground/70 mt-3 text-sm">
            Nutrição esportiva de alta performance desde 1987. Ciência, qualidade e resultado em
            cada dose.
          </p>
          <div className="mt-4 flex gap-3">
            <Instagram className="hover:text-primary size-5 cursor-pointer" />
            <Facebook className="hover:text-primary size-5 cursor-pointer" />
            <Youtube className="hover:text-primary size-5 cursor-pointer" />
          </div>
        </div>

        <div>
          <h3 className="text-primary text-sm font-bold uppercase">Loja</h3>
          <ul className="text-secondary-foreground/70 mt-4 space-y-2 text-sm">
            <li>
              <Link to="/produtos" search={{ categoria: undefined, busca: undefined }}>
                Todos os produtos
              </Link>
            </li>
            <li>
              <Link to="/produtos" search={{ categoria: "proteinas", busca: undefined }}>
                Proteínas
              </Link>
            </li>
            <li>
              <Link to="/produtos" search={{ categoria: "creatinas", busca: undefined }}>
                Creatinas
              </Link>
            </li>
            <li>
              <Link to="/produtos" search={{ categoria: "pre-treinos", busca: undefined }}>
                Pré-Treinos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-primary text-sm font-bold uppercase">Institucional</h3>
          <ul className="text-secondary-foreground/70 mt-4 space-y-2 text-sm">
            <li>
              <Link to="/sobre">Sobre a marca</Link>
            </li>
            <li>
              <Link to="/contato">Fale conosco</Link>
            </li>
            <li>
              <Link to="/conta">Minha conta</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-primary text-sm font-bold uppercase">Atendimento</h3>
          <p className="text-secondary-foreground/70 mt-4 text-sm">
            Seg a sex, das 8h às 18h
            <br />
            0800 000 0000
            <br />
            sac@integralmedica.com.br
          </p>
        </div>
      </div>
      <div className="border-secondary-foreground/10 mx-auto grid max-w-7xl gap-8 border-t px-4 py-8 sm:grid-cols-2">
        <div>
          <h3 className="text-primary text-sm font-bold uppercase">Métodos de pagamento</h3>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {PAYMENTS.map((p) => (
              <img key={p.alt} src={p.src} alt={p.alt} loading="lazy" className="h-7 w-auto rounded-sm bg-white p-1" />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-primary text-sm font-bold uppercase">Selo de segurança</h3>
          <img src={googleSafe} alt="Google Safe Badge" loading="lazy" className="mt-4 h-12 w-auto" />
        </div>
      </div>
      <div className="border-secondary-foreground/10 text-secondary-foreground/50 border-t py-5 text-center text-xs">
        © {new Date().getFullYear()} Integralmédica · Clone demonstrativo para fins de estudo.
      </div>

    </footer>
  );
}
