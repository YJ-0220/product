import dotenv from "dotenv";
import path from "path";

// dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}`);
dotenv.config({ path: envPath });

export const env = {
  NODE_ENV,
  PORT: parseInt(process.env.PORT || "3000", 10),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
} as const;
