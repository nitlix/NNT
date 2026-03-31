import createDb from "./createDb";

const db = createDb({ connectionString: process.env.DATABASE_URL! });

export default db;