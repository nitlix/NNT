# NNT — Agent Overview

This repository is a **Next.js App Router template** that ships with a small “app backbone” (navigation + smooth scrolling), basic **i18n routing**, theme switching, and optional **Cloudflare Workers** tooling.

## What this project is

- **Framework**: Next.js (App Router) + React
- **Styling**: Tailwind (v4), SCSS (`.scss`) alongside Tailwind
- **Theming**: `next-themes` + CSS variables in `src/backbone/themes.scss`
- **Meta**: `nitlix-metagen` used in `src/app/layout.tsx`
- **Scroll + navigation backbone**:
    - `src/backbone/Backbone.tsx` provides:
        - `NavigationContext` with a `navigate(url, scroll?)` helper
        - `SPContext` with Lenis smooth scrolling that is enabled on wide screens
    - `src/components/BetterA.tsx` is a client `<a>` wrapper that uses `NavigationContext.navigate`
- **Animation on scroll (AOS)**: `nitlix-aos` initialized in `src/lib/Aos/Aos.tsx` and mounted in `src/app/layout.tsx`
- **Database (optional)**: Drizzle ORM + Neon serverless Postgres
    - `src/db/createDb.ts` creates a Drizzle client using `@neondatabase/serverless` + `drizzle-orm/neon-http`
    - `src/db/db.ts` exports a singleton `db` using `process.env.DATABASE_URL`
    - `src/db/schema.ts` contains the sample schema (`users` table)
    - `drizzle.config.ts` points drizzle-kit to `src/db/schema.ts` and uses `DATABASE_URL`

## i18n routing (current state)

- There is an App Router locale segment: `src/app/[locale]/page.tsx`.
- There is also a locale-redirect “proxy/middleware” implementation at `src/proxy.ts`.
    - It is **not auto-wired by Next.js** from this location. If you want locale redirects, you typically expose this logic via a root `middleware.ts` (or adapt to your desired setup).

## Cloudflare Workers (optional)

Workers are configured to live alongside the Next app.

- **Entrypoint**: `src/cloudflare/worker.ts`
- **Wrangler config**: `wrangler.jsonc`
    - uses `compatibility_flags: ["nodejs_compat"]`
    - observability enabled
    - templates for bindings (Durable Objects / KV / D1 / R2) are included as commented blocks
- **Type bindings**: `worker-configuration.d.ts` (large generated typings file)

Useful scripts from `package.json`:

- `pnpm ws` → `wrangler dev`
- `pnpm wt` → `wrangler types`

## Key files & directories

- **App layout**: `src/app/layout.tsx`
    - imports global CSS and theme CSS
    - mounts `Backbone`, `Aos`, and `ThemeProvider`
    - sets default metadata via `nitlix-metagen`
- **Global styles**: `src/app/globals.css`, `src/app/animations.scss`
- **Backbone**: `src/backbone/*`
- **Components**: `src/components/*`
- **DB**: `src/db/*`
- **Workers**: `src/cloudflare/*`

## Environment variables

- **`DATABASE_URL`**: required if you use `src/db/db.ts` or run drizzle tooling configured by `drizzle.config.ts`.

## Common commands (pnpm)

- **Install**: `pnpm i`
- **Dev**: `pnpm dev`
- **Lint**: `pnpm lint`
- **Worker dev**: `pnpm ws`
- **Worker types**: `pnpm wt`
