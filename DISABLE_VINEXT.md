### Vinext (agent / human guide)

This project uses **Vinext** for development and deployment by default. Keep in mind, `vinext` is an experimental stack; it may still contain bugs. It aims to act as a full replacement for Next.js while leaning on Vite and related tooling.

---

### Switching this project from Vinext to Next.js

If you want a plain **Next.js** dev/build pipeline (no Vinext, no Vite config, no Vinext site worker), do the following. You can paste this file into Cursor or another local AI and ask it to apply the steps carefully.

1. **`package.json` — scripts**

    Replace every `vinext` CLI usage with `next`:
    - `vinext dev` → `next dev`
    - `vinext build` → `next build`
    - `vinext start` → `next start`
    - `vinext lint` → `next lint`

    Remove the **`deploy:site`** script if it only exists for the Vinext + Cloudflare Vite pipeline (`wrangler deploy -c wrangler-site.jsonc`). Keep **`deploy:worker`** / **`ws`** / **`wt`** if you still use the separate API worker (`wrangler-worker.jsonc`).

2. **`package.json` — dependencies**

    Remove Vinext and everything that exists only to support the Vinext/Vite/RSC build (adjust names if your lockfile differs):
    - `vinext`
    - `vite`
    - `@vitejs/plugin-react`
    - `@vitejs/plugin-rsc`
    - `@cloudflare/vite-plugin`
    - `react-server-dom-webpack` (typically only needed for the Vinext/Vite RSC setup; Next.js brings its own RSC runtime)

    Do **not** remove `next`, `react`, `react-dom`, Tailwind/PostCSS, Drizzle, etc.

3. **Reinstall**

    After editing `package.json`, reinstall so `node_modules` matches (use whatever you use):
    - `bun i` / `pnpm i` / `npm i`

4. **PostCSS: rename `.cjs` → `.js` and align TypeScript**

    This repo keeps PostCSS in **`postcss.config.cjs`** so `module.exports` works while **`package.json`** has `"type": "module"`. For a Next-centric setup, use the conventional name **`postcss.config.js`** and make the file valid ESM (because `.js` at the project root is treated as ESM when `"type": "module"` is set):

    - **Rename** `postcss.config.cjs` → `postcss.config.js`.
    - **Replace** `module.exports = { ... }` with **`export default { ... }`** (same `plugins` object inside).
    - **`tsconfig.json`** — in `include`, change `postcss.config.cjs` to `postcss.config.js` (if either entry is present).

    If you prefer to keep CommonJS for PostCSS only, you can leave the filename as **`postcss.config.cjs`**; Next.js will still pick it up. The rename is optional but matches typical Next examples and avoids the `.cjs` suffix when you no longer need it for Vinext/Vite.

5. **Delete Vinext-specific files and traces**
    - **`vite.config.ts`** — remove entirely.
    - **`wrangler-site.jsonc`** — remove if it was only for the Vinext “site” worker (it points at `worker/index.ts` by default).
    - **`worker/`** — remove the whole folder if you have a site entry worker (e.g. `worker/index.ts`) used only for that pipeline. If you have no `worker/` directory, skip this; the important part is not leaving a stale `wrangler-site` deploy pointing at missing files.
    - **Root `wrangler.jsonc`** — if it only existed to deploy the Vinext site worker (`main` → `worker/index.ts`, Vinext image routes, etc.), remove it or replace it with whatever you use for a non-Vinext Next deploy on Cloudflare (e.g. OpenNext), so you do not deploy a broken worker.

6. **Environment variables (if you used Vite-style env in app code)**

    Replace **`import.meta.env.VITE_*`** with **`process.env.NEXT_PUBLIC_*`** for values that must be exposed to the browser, and define them accordingly in `.env` / hosting. Server-only secrets should use server env vars without the `NEXT_PUBLIC_` prefix.

7. **`next.config.ts`**

    Strip any Vinext- or Vite-specific options if they were added there. A minimal Next config is fine for a standard app.

8. **Sanity check**
    - Run `next dev` and open the app.
    - Run `next build` once.
    - Search the repo for `vinext`, `vite`, `@cloudflare/vite-plugin`, and `import.meta.env` and remove any remaining references (imports, comments, CI).

That is the full switch: **scripts → next**, **strip Vinext/Vite-only deps**, **reinstall**, **PostCSS `.cjs` → `.js` + ESM (optional but documented above)**, **remove `vite.config.ts` + site worker wiring + `worker/` if used**, **fix env and wrangler** as needed.
