import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export default function createDb({ connectionString }: { connectionString: string }) {
    const sql = neon(connectionString);
    return drizzle(sql, { schema: schema });
}