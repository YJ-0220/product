import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("❌ DATABASE_URL is not set");
}

const pool = new Pool({ connectionString: databaseUrl });

export default pool;
