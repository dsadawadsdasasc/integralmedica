import whey from "@/assets/prod-whey.jpg";
import creatina from "@/assets/prod-creatina.jpg";
import preworkout from "@/assets/prod-preworkout.jpg";
import barra from "@/assets/prod-barra.jpg";
import bcaa from "@/assets/prod-bcaa.jpg";
import hipercalorico from "@/assets/prod-hipercalorico.jpg";
import categoryBackground from "@/assets/official/category-bg.png";
import catCreatina from "@/assets/official/cat-creatina.png";
import catWhey from "@/assets/official/cat-whey.png";
import catBarra from "@/assets/official/cat-barra.webp";
import catHiper from "@/assets/official/cat-hiper.png";
import catAmino from "@/assets/official/cat-amino.webp";
import catPre from "@/assets/official/cat-pre.png";
import catVestuario from "@/assets/official/cat-vestuario.png";
import catAcessorios from "@/assets/official/cat-acessorios.png";

const map: Record<string, string> = {
  whey,
  creatina,
  preworkout,
  barra,
  bcaa,
  hipercalorico,
};

export function productImage(key: string) {
  return map[key] ?? whey;
}

const categoryMap: Record<string, string> = {
  proteinas: catWhey,
  "whey-protein": catWhey,
  creatina: catCreatina,
  creatinas: catCreatina,
  aminoacidos: catAmino,
  glutaminas: catAmino,
  "pre-treino": catPre,
  "pre-treinos": catPre,
  barras: catBarra,
  "barras-e-snacks": catBarra,
  "barra-de-proteina": catBarra,
  hipercalorico: catHiper,
  hipercaloricos: catHiper,
  vestuario: catVestuario,
  acessorios: catAcessorios,
};

export function categoryImage(slug: string) {
  return categoryMap[slug] ?? catWhey;
}

export { categoryBackground };
