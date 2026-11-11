import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnv } from "node:util";
import { loadEnv } from "vite";

/**
 * Next.js dotenv lookup order, highest priority first.
 * `.env.local` is skipped in test mode, same as Next and vinext.
 */
function envFiles(mode: string) {
    return [
        `.env.${mode}.local`,
        mode === "test" ? null : ".env.local",
        `.env.${mode}`,
        ".env",
    ].filter((file): file is string => file !== null);
}

const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**
 * Loads the project's .env files for `mode` and returns only the keys those
 * files declare. Shell/CI values win over file values, like Next.js.
 *
 * Also fills `process.env` (without overwriting) so config-time code and the
 * dev server see the same values. Plain `vite dev`/`vite build` don't do this;
 * the old `vinext dev`/`vinext build` wrappers did.
 */
export function loadProjectEnv(mode: string, root = process.cwd()) {
    const declared = new Set<string>();

    for (const file of envFiles(mode)) {
        const path = resolve(root, file);

        if (!existsSync(path)) {
            continue;
        }

        for (const key of Object.keys(parseEnv(readFileSync(path, "utf8")))) {
            declared.add(key);
        }
    }

    // Empty prefix = every var. loadEnv handles precedence and $VAR expansion.
    const all = loadEnv(mode, root, "");
    const env: Record<string, string> = {};

    for (const key of declared) {
        if (!IDENTIFIER.test(key) || all[key] === undefined) {
            continue;
        }

        env[key] = all[key];
        process.env[key] ??= all[key];
    }

    return env;
}

/**
 * `process.env.KEY` replacements for server bundles, so .env values are
 * baked in at build time. Deployed Workers never read .env files, so
 * without this, server-only vars are undefined in production.
 */
export function serverEnvDefine(env: Record<string, string>) {
    return Object.fromEntries(
        Object.entries(env).map(([key, value]) => [
            `process.env.${key}`,
            JSON.stringify(value),
        ]),
    );
}
