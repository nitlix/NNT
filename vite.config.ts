import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { loadProjectEnv, serverEnvDefine } from "./vite.env.ts";

export default defineConfig(({ command, mode }) => {
    // vite dev = development, vite build = production (.env.<mode> files).
    const env = loadProjectEnv(mode);
    const serverDefine = serverEnvDefine(env);

    return {
        // Vite's default is 5173. strictPort fails instead of hopping ports.
        server: { port: 3000, strictPort: true },
        preview: { port: 3000, strictPort: true },
        // Every .env key (NEXT_PUBLIC_* included) goes to the server bundles.
        // The client only gets NEXT_PUBLIC_*, which vinext inlines itself,
        // so server secrets never reach the browser.
        environments: {
            rsc: { define: serverDefine },
            ssr: { define: serverDefine },
        },
        plugins: [
            tailwindcss(),
            vinext(),
            ...(command === "build"
                ? [
                      cloudflare({
                          viteEnvironment: {
                              name: "rsc",
                              childEnvironments: ["ssr"],
                          },
                      }),
                  ]
                : []),
        ],
    };
});
