import { Destination } from "../types";

const photos: Record<string, string> = {
  PT: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200",
  FR: "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1200",
  IT: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200",
  ES: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200",
  GR: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200",
  JP: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200",
  CH: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200",
  BR: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200"
};

const descriptions: Record<string, string> = {
  PT: "Descobre cidades históricas, praias atlânticas, gastronomia e paisagens únicas.",
  FR: "Arte, cultura, aldeias encantadoras e gastronomia reconhecida em todo o mundo.",
  IT: "Um destino de história, arquitetura, paisagens costeiras e cozinha inesquecível.",
  ES: "Cidades vibrantes, praias soalheiras, cultura e sabores mediterrânicos.",
  GR: "Ilhas de águas cristalinas, ruínas antigas e aldeias caiadas de branco.",
  JP: "Tradição e inovação convivem entre templos, jardins e grandes metrópoles.",
  CH: "Montanhas alpinas, lagos de água límpida e trilhos de natureza.",
  BR: "Praias, floresta tropical, música e uma enorme diversidade cultural."
};

const categories: Record<string, Destination["category"]> = {
  PT: "Cultura", FR: "Cidades", IT: "Cultura", ES: "Praias",
  GR: "Praias", JP: "Cultura", CH: "Natureza", BR: "Natureza"
};

export async function getDestinations(): Promise<Destination[]> {
  const response = await fetch("https://restcountries.com/v3.1/alpha?codes=pt,fr,it,es,gr,jp,ch,br&fields=cca2,name,translations,capital,region,population,flags");
  if (!response.ok) throw new Error("Não foi possível obter os destinos da API.");
  const rows = await response.json();
  return rows.map((row: any) => {
    const code = String(row.cca2).toUpperCase();
    return {
      code,
      name: row.translations?.por?.common || row.name?.common || code,
      capital: row.capital?.[0] || "Capital não indicada",
      region: row.region || "—",
      population: row.population || 0,
      flag: row.flags?.png || "",
      image: photos[code] || row.flags?.png || "",
      description: descriptions[code] || "Descobre este destino e prepara a tua próxima viagem.",
      category: categories[code] || "Cidades"
    };
  }).sort((a: Destination, b: Destination) => a.name.localeCompare(b.name, "pt-PT"));
}
