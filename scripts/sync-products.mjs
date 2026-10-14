// Pulls the curated lineup from the official Osaki USA store (osakiusa.com)
// into src/data/products.json and caches product photos in public/assets/products.
// Run: npm run sync:products
import { mkdir, writeFile, rm } from "node:fs/promises";
import sharp from "sharp";

const STORE = "https://osakiusa.com";
const IMG_DIR = "public/assets/products";
const OUT = "src/data/products.json";

const picks = {
  Osaki: [
    "osaki-pro-4d-epic-le",
    "osaki-aeris-4d-duo",
    "osaki-highpointe-4d",
    "osaki-3d-quantum-massage-chair",
    "osaki-duke-xl-4d",
    "osaki-ai-apex-5d-4d-duo",
    "osaki-platinum-sapphire-4d",
    "osaki-oasis",
  ],
  Titan: [
    "titan-vega-duo-massage-chair",
    "titan-ethos-duo-4d-3d",
    "titan-pro-4d-astro",
    "titan-tp-epic-4d",
    "titan-pro-4d-endor",
    "titan-4d-ion-rt5653",
    "osaki-forma",
    "titan-gemini",
  ],
  AmaMedic: [
    "amamedic-haven-4d",
    "amamedic-ai-revive-4d",
    "amamedic-hilux-4d",
    "amamedic-3d-astoria",
  ],
};

const featured = [
  "osaki-pro-4d-epic-le",
  "titan-vega-duo-massage-chair",
  "amamedic-haven-4d",
  "osaki-aeris-4d-duo",
  "titan-pro-4d-astro",
  "osaki-highpointe-4d",
  "amamedic-ai-revive-4d",
  "osaki-ai-apex-5d-4d-duo",
];

// Image index on the store listing for models whose first studio shots carry a color swatch.
const shotOverride = {
  "osaki-pro-4d-epic-le": 13,
  "osaki-aeris-4d-duo": 13,
  "osaki-highpointe-4d": 2,
  "titan-vega-duo-massage-chair": 13,
  "amamedic-hilux-4d": 2,
};

// Lifestyle shots also exported as wide banners (public/assets/products/{handle}-wide.webp).
const wide = ["osaki-ai-apex-5d-4d-duo", "amamedic-haven-4d", "titan-vega-duo-massage-chair", "osaki-aeris-4d-duo", "titan-pro-4d-astro"];

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "’").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");

const tidy = (s) => {
  const t = s.replace(/_/g, "-").replace(/\s+/g, " ").trim();
  if (t !== t.toUpperCase()) return t;
  return t
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\b(\d)d\b/gi, "$1D")
    .replace(/\bSl\b/g, "SL")
    .replace(/\bAi\b/g, "AI");
};

function cleanTitle(raw) {
  const note = raw.match(/\(([^)]*warranty[^)]*)\)/i)?.[1] ?? "";
  let badge = null;
  if (/5\s*yr/i.test(note)) badge = "5-yr warranty";
  else if (/2\s*yr/i.test(note)) badge = "Free 2-yr ext. warranty";
  const name = raw.replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
  return { name, badge };
}

function features(html = "") {
  const items = [...html.matchAll(/<(li|p|h\d|span)[^>]*>(.*?)<\/\1>/gs)]
    .map((m) => decode(m[2].replace(/<[^>]+>/g, "")).trim())
    .filter((t) => t && t.length < 44 && !/externalURL|const /.test(t));
  return [...new Set(items.map(tidy))].slice(0, 3);
}

async function load(src, width) {
  const res = await fetch(`${src}${src.includes("?") ? "&" : "?"}width=${width}`);
  return Buffer.from(await res.arrayBuffer());
}

// "clean" = white studio background with no color-swatch circle in a top corner.
async function grade(buf) {
  const n = 60;
  const { data } = await sharp(buf).resize(n, n, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const lum = (x, y) => {
    const i = (y * n + x) * 3;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  };
  const corners = [lum(1, 1), lum(n - 2, 1), lum(1, n - 2), lum(n - 2, n - 2)];
  if (!corners.every((v) => v > 236)) return "scene";
  const box = Math.round(n * 0.3);
  const busy = (x0) => {
    let dark = 0;
    for (let y = 0; y < box; y++) for (let x = x0; x < x0 + box; x++) if (lum(x, y) < 225) dark++;
    return dark / (box * box);
  };
  const left = busy(0);
  const right = busy(n - box);
  if (left <= 0.06 && right <= 0.06) return "clean";
  return left > right ? "swatch-left" : "swatch-right";
}

async function whiteOutSwatch(buf, side) {
  const img = sharp(buf);
  const { width, height } = await img.metadata();
  const w = Math.round(width * 0.32);
  const h = Math.round(height * 0.37);
  const patch = await sharp({ create: { width: w, height: h, channels: 3, background: "#ffffff" } }).png().toBuffer();
  return img.composite([{ input: patch, left: side === "swatch-left" ? 0 : width - w, top: 0 }]).toBuffer();
}

const res = await fetch(`${STORE}/products.json?limit=250`, { headers: { "user-agent": "Mozilla/5.0" } });
if (!res.ok) throw new Error(`Store returned ${res.status}`);
const { products } = await res.json();
const byHandle = new Map(products.map((p) => [p.handle, p]));

await rm(IMG_DIR, { recursive: true, force: true });
await mkdir(IMG_DIR, { recursive: true });
const out = [];

for (const [brand, handles] of Object.entries(picks)) {
  for (const handle of handles) {
    const p = byHandle.get(handle);
    if (!p) {
      console.warn(`missing: ${handle}`);
      continue;
    }
    const variant = p.variants.find((v) => v.available) ?? p.variants[0];
    const price = Number(variant.price);
    const compare = Number(variant.compare_at_price) || null;
    const { name, badge } = cleanTitle(p.title);

    let studio = p.images[shotOverride[handle]]?.src ?? null;
    let swatch = null;
    for (const img of studio ? [] : p.images.slice(0, 12)) {
      const g = await grade(await load(img.src, 200));
      if (g === "clean") {
        studio = img.src;
        swatch = null;
        break;
      }
      if (g.startsWith("swatch") && !swatch) swatch = { src: img.src, side: g };
    }
    studio ??= swatch?.src ?? null;
    const lifestyleSrc = p.images[0].src;
    const cutout = `/assets/products/${handle}.webp`;
    const scene = `/assets/products/${handle}-scene.webp`;
    let shot = await load(studio ?? p.images[0].src, 1000);
    if (swatch) shot = await whiteOutSwatch(shot, swatch.side);
    const trimmed = await sharp(shot).trim({ background: "#ffffff", threshold: 12 }).toBuffer();
    await sharp(trimmed)
      .resize(720, 720, { fit: "contain", background: "#ffffff" })
      .extend({ top: 40, bottom: 40, left: 40, right: 40, background: "#ffffff" })
      .flatten({ background: "#ffffff" })
      .webp({ quality: 80 })
      .toFile(`public${cutout}`);
    await sharp(await load(lifestyleSrc, 1400)).resize(1200, 1200, { fit: "inside" }).webp({ quality: 76 }).toFile(`public${scene}`);
    if (wide.includes(handle)) {
      const full = await load(lifestyleSrc, 1600);
      const { width } = await sharp(full).metadata();
      await sharp(full)
        .resize(width, Math.round(width * 0.54), { fit: "cover", position: "attention" })
        .webp({ quality: 74 })
        .toFile(`public/assets/products/${handle}-wide.webp`);
    }

    out.push({
      handle,
      brand,
      name,
      badge,
      features: features(p.body_html),
      price,
      compareAt: compare && compare > price ? compare : null,
      available: p.variants.some((v) => v.available),
      image: cutout,
      studio: Boolean(studio),
      scene,
      url: `${STORE}/products/${handle}`,
      featured: featured.includes(handle),
    });
    console.log(`${swatch ? "swatch" : studio ? "clean " : "scene "}  ${name}`);
  }
}

const data = { source: STORE, syncedAt: new Date().toISOString().slice(0, 10), products: out };
await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
console.log(`wrote ${out.length} products to ${OUT}`);
