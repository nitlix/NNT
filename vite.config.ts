import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
    plugins: [
        tailwindcss(),
        vinext(),
        ...(command === "build"
            ? [cloudflare({
                viteEnvironment: {
                    name: "rsc",
                    childEnvironments: ["ssr"],
                },
            })]
            : []),
    ],
}));