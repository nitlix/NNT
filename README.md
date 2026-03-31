<p align="center">
    <img src="https://static.nitlix.net/github/NNT3.webp" align="center" />
</p>

## NNT (Next.js Template) — ship faster

NNT is a **production-lean Next.js App Router starter** with opinionated UX defaults (smooth scroll + navigation helpers), modern styling, optional DB wiring, and **Cloudflare Workers** support.

If you’re evaluating templates, this README is written to help you decide quickly.

## Template fit (pick this when…)

- **You want**: a clean App Router baseline with theming, metadata defaults, smooth scrolling, and a small navigation “backbone”.
- **You don’t want**: a huge starter with auth/payments/content systems prebuilt.
- **You may also want**: a Worker in the same repo for edge endpoints / webhooks / background-ish edge tasks.

## What you get out of the box

- **Next.js App Router**: `src/app/*`
- **Theme switching**: `next-themes` + CSS variables in `src/backbone/themes.scss`
- **Smooth scrolling**: Lenis integrated via `src/backbone/Backbone.tsx`
- **Navigation helper**: `NavigationContext.navigate(...)` + `<BetterA />` link component
- **AOS**: `nitlix-aos` initialized on route changes (`src/lib/Aos/Aos.tsx`)
- **Metadata defaults**: `nitlix-metagen` in `src/app/layout.tsx`
- **Styling**: Tailwind + SCSS (`src/app/globals.css`, `src/app/animations.scss`)
- **Database (optional)**: Drizzle ORM + Neon serverless Postgres (`src/db/*`)
- **i18n routing (optional)**:
    - Locale route segment: `src/app/[locale]/page.tsx`
    - Locale redirect logic present in `src/proxy.ts` (wire it as middleware if you want redirects)
- **Cloudflare Workers (optional)**:
    - Entrypoint: `src/cloudflare/worker.ts`
    - Config: `wrangler.jsonc`

## Quickstart

### Option A — CLI (create-napp)

If you use `create-napp`, install it with pnpm and run it:

```bash
pnpm add -g create-napp@latest
create-napp
```

### Option B — Clone

```bash
gh repo clone Nitlix/NNT <your-project>
cd <your-project>
pnpm i
pnpm dev
```

Then open `http://localhost:3000`.

## Common commands (pnpm)

```bash
pnpm dev        # Next dev server
pnpm build      # Next build
pnpm start      # Next start
pnpm lint       # Next lint
pnpm ws         # Wrangler dev (Cloudflare Worker)
pnpm wt         # Wrangler types (Cloudflare Worker)
```

## Environment variables

- **`DATABASE_URL`**: required if you use Drizzle/Neon (`src/db/db.ts`) or run drizzle tooling (`drizzle.config.ts`).

## Where to edit things

- **App shell**: `src/app/layout.tsx` (theme provider, backbone, AOS, metadata defaults)
- **Locale page**: `src/app/[locale]/page.tsx`
- **Theme switch UI**: `src/components/ThemeSwitcher.tsx`
- **Navigation/smooth scroll**: `src/backbone/Backbone.tsx`
- **DB schema**: `src/db/schema.ts`
- **Worker**: `src/cloudflare/worker.ts` + `wrangler.jsonc`

## For contributors / agents

See `FOR_AGENTS.md` for a repo-wide overview (structure, modules, scripts, and the worker setup).
