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

`.env` files are loaded by `vite.env.ts`, wired up in `vite.config.ts`, so this works with plain `vite dev` / `vite build` (vinext 1.x no longer preloads them for you).

- **Load order** (highest first): shell/CI → `.env.<mode>.local` → `.env.local` → `.env.<mode>` → `.env`. `vite dev` is `development`, `vite build` is `production`.
- **`NEXT_PUBLIC_*`**: baked into **both** server and client bundles.
- **Everything else**: baked into **server bundles only** (server components, route handlers, actions), never into browser bundles.
- Values are baked in at build time because a deployed Worker never reads `.env`.
- **Cloudflare dashboard**: *Build variables* behave like the shell: `NEXT_PUBLIC_*` gets baked into server + client, other build variables do **not** reach server code. Put server-only values in the Worker's runtime *Variables and Secrets*; server code reads them via `process.env` at runtime (`nodejs_compat`).
- To override a value for one build, set it in the shell: `SOME_KEY=x bun run build`.
- Restart `bun run dev` after editing `.env`.

- **`DATABASE_URL`**: required if you use Drizzle/Neon (`src/db/db.ts`) or run drizzle tooling (`drizzle.config.ts`).

## Common commands (pnpm)

- **Install**: `pnpm i`
- **Dev**: `pnpm dev`
- **Lint**: `pnpm lint`
- **Worker dev**: `pnpm ws`
- **Worker types**: `pnpm wt`
