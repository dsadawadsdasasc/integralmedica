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
