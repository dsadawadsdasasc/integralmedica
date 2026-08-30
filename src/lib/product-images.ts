import whey from "@/assets/prod-whey.jpg";
import creatina from "@/assets/prod-creatina.jpg";
import preworkout from "@/assets/prod-preworkout.jpg";
import barra from "@/assets/prod-barra.jpg";
import bcaa from "@/assets/prod-bcaa.jpg";
import hipercalorico from "@/assets/prod-hipercalorico.jpg";

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
  proteinas: whey,
  "whey-protein": whey,
  creatina: creatina,
  creatinas: creatina,
  aminoacidos: bcaa,
  "pre-treino": preworkout,
  "pre-treinos": preworkout,
  barras: barra,
  "barras-e-snacks": barra,
  "barra-de-proteina": barra,
  hipercalorico: hipercalorico,
  hipercaloricos: hipercalorico,
};

export function categoryImage(slug: string) {
  return categoryMap[slug] ?? whey;
}
