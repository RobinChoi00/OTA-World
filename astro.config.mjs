// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.ota-world.com",
  integrations: [sitemap()],
  redirects: {
    "/stores": "/dealers",
  },
  server: {
    port: 5173,
    host: true,
  },
  prefetch: true,
});
