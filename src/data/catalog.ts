import data from "./products.json";

export type Product = (typeof data.products)[number];
export type Brand = "Osaki" | "Titan" | "AmaMedic";

export const catalog = data;
export const products = data.products as Product[];

export const priceSource = {
  name: data.source.replace(/^https?:\/\//, ""),
  url: data.source,
  date: new Date(`${data.syncedAt}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
};

export const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const savings = (p: Product) => (p.compareAt ? p.compareAt - p.price : 0);

export const featured = products.filter((p) => p.featured);
export const byBrand = (brand: Brand) => products.filter((p) => p.brand === brand);
export const find = (handle: string) => products.find((p) => p.handle === handle)!;

/** Display name without the brand prefix, e.g. "Pro 4D Epic LE". */
export const model = (p: Product) => p.name.replace(new RegExp(`^${p.brand}\\s+`), "").replace(/^OS-/, "");

export const budgets = [
  { id: "under-3000", label: "Under $3,000", max: 3000, min: 0, text: "Full-body 3D and 4D chairs to start." },
  { id: "3000-5000", label: "$3,000 – $5,000", max: 5000, min: 3000, text: "4D tracks, body scan, voice control." },
  { id: "5000-up", label: "$5,000 and up", max: Infinity, min: 5000, text: "Duo mechanisms and flagship builds." },
] as const;

export const inBudget = (p: Product, id: string) => {
  const b = budgets.find((x) => x.id === id);
  return b ? p.price >= b.min && p.price < b.max : true;
};
