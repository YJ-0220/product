import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT 1").then(() => {
  console.log("Connected to the database");
}).catch((err) => {
  console.error("Error connecting to the database", err);
});

export default pool;
