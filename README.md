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

## Structure

- `src/pages` — routes (`/`, `/about`, `/products`, …)
- `src/layouts/BaseLayout.astro` — shared head, header, footer, view transitions
- `src/components` — Header, Footer
- `src/data/site.ts` — company facts (phone, hours, brands)
- `src/styles.css` — site styles
- `src/scripts/site.js` — menu, form (mailto), scroll, reveal
- `public/assets/images` — photos and favicon
- `_legacy` — previous static HTML (reference only)

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | The Brand |
| `/products` | Lineup |
| `/stores` | Showrooms |
| `/care` | Care |
| `/franchise` | Partners |
| `/contact` | Contact |
| `/privacy` | Privacy |
