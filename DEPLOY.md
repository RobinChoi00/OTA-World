# Deploy domains (Vercel)

Goal:

| URL | What runs there |
| --- | --- |
| `https://v1.ota-world.com` | Current live Next.js site (keep as archive) |
| `https://www.ota-world.com` / `https://ota-world.com` | This Astro repo (new site) |

You need access to **both** Vercel projects: the existing Next.js project already serving `ota-world.com`, and a new project for this repo.

## 1. Move the old site → `v1.ota-world.com`

In [Vercel Dashboard](https://vercel.com/dashboard):

1. Open the **existing** project that currently owns `ota-world.com` / `www.ota-world.com`.
2. **Settings → Domains**
3. Add `v1.ota-world.com`
4. Follow the DNS prompt (usually a `CNAME` for `v1` → `cname.vercel-dns.com`)
5. Wait until `v1.ota-world.com` shows **Valid**
6. Open `https://v1.ota-world.com` and confirm the old site loads
7. **Only then** remove `ota-world.com` and `www.ota-world.com` from this old project

Do not remove the apex/www domains before `v1` is working.

## 2. Put this Astro project on `ota-world.com`

1. **Add New Project** → Import `RobinChoi00/OTA-World` (this repo, branch `main`)
2. Framework: **Astro** (auto-detected)
3. Build: `npm run build` · Output: `dist` · Node: **22.x**
4. Deploy
5. **Settings → Domains** → add:
   - `www.ota-world.com`
   - `ota-world.com` (redirect www ↔ apex as you prefer; usual: apex → www)
6. At your DNS host (wherever `ota-world.com` is managed), point:
   - `www` → Vercel (`CNAME` → `cname.vercel-dns.com`), or use Vercel nameservers
   - Apex `@` → Vercel `A` records (Vercel shows the exact IPs)

When DNS propagates, `https://www.ota-world.com` should show the Astro site and `https://v1.ota-world.com` the old Next.js site.

## Order (important)

1. Attach `v1` to the **old** project and verify  
2. Remove apex/`www` from the **old** project  
3. Attach apex/`www` to the **new** Astro project  

If you reverse that, the live domain goes blank until DNS/Vercel catch up.

## Local `v1/` folder

Optional reference only (HTML snapshots / pre-Astro static). Not used for production. Production V1 = the existing Next.js deployment under `v1.ota-world.com`.
