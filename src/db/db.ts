import { drizzle } from 'drizzle-orm/neon-http'; // Or 'neon-serverless' / 'node-postgres'
import { neon } from '@neondatabase/serverless';
import * as schema from './schema'; // 👈 Import your schema here

const sql = neon(process.env.DATABASE_URL!);

// 🚀 Pass the schema to the drizzle function
export default drizzle(sql, { schema });