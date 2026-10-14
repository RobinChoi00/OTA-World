# OTA World

Company site for **OTA World, LLC** — America’s No. 1 house of Osaki, Titan, and AmaMedic.

Built with [Astro](https://astro.build). Design and copy migrated from the static HTML prototype.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Product prices

The lineup (names, prices, compare-at prices, features, photos) comes from the official store at
osakiusa.com. Refresh it, then commit the result:

```bash
npm run sync:products
```

This rewrites `src/data/products.json` and `public/assets/products/`. The models shown are picked
in `scripts/sync-products.mjs`. Pages print the sync date next to every price.

## Structure

- `src/pages` — routes (`/`, `/about`, `/products`, …)
- `src/layouts/BaseLayout.astro` — shared head, header, footer, view transitions
- `src/components` — Header, Footer, ProductCard, ProductRail
- `src/data/site.ts` — company facts (phone, hours, brands)
- `src/data/catalog.ts` — product helpers over `products.json`
- `src/styles.css` — site styles
- `src/scripts/site.js` — menu, product rail, lineup filters, form (mailto)
- `public/assets/images` — photos and favicon
- `public/assets/products` — product photos from the brand store
- `v1/` — optional local HTML reference only (not production)

## Domains (Vercel)

| Domain | Site |
| --- | --- |
| `v1.ota-world.com` | Existing Next.js (keep) |
| `www.ota-world.com` / `ota-world.com` | This Astro project |

Step-by-step: [`DEPLOY.md`](./DEPLOY.md)

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | The Brand |
| `/products` | Lineup |
| `/dealers` | Dealer Locator |
| `/care` | Care |
| `/franchise` | Partners |
| `/contact` | Contact |
| `/privacy` | Privacy |
