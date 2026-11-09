export type User = { id: string; name: string; email: string };
export type Destination = {
  code: string; name: string; capital: string; region: string;
  population: number; flag: string; image: string; description: string;
  category: "Cidades" | "Praias" | "Natureza" | "Cultura";
};
export type Trip = { id: string; destination: Destination; start: string; end: string; notes: string };
export type Review = { id: string; destinationCode: string; author: string; rating: number; comment: string; date: string };
