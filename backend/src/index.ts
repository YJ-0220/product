import express from "express";
import pool from "./db/db";
import dotenv from "dotenv";
import authRouter from "./routes/auth";

dotenv.config();

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`DB 연결 성공! 현재 시간: ${result.rows[0].now}`);
  } catch (error) {
    res.status(500).send("DB 연결 실패: " + (error as Error).message);
  }
});

app.use("/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`process.env.JWT_SECRET: ${process.env.JWT_SECRET}`);
});
