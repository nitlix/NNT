import "dotenv/config";
import { defineConfig, env, PrismaConfig } from "prisma/config";

export default defineConfig({
    schema: "src/prisma/schema.prisma",
    migrations: {
        path: "src/prisma/migrations",
        seed: "tsx src/prisma/seed.ts",
    },
    datasource: {
        url: "",
    },
}) satisfies PrismaConfig;
