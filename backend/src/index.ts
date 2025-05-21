import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import pool from "./db/db";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);


(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("DB 연결 성공:", res.rows);
  } catch (err) {
    console.error("DB 연결 실패:", err);
  }
})();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`process.env.DATABASE_URL: ${process.env.DATABASE_URL}`);
  console.log(typeof process.env.DATABASE_URL)
});
