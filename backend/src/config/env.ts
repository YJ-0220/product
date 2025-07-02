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
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
} as const;