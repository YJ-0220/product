import express from "express";
import pool from "./db/db";
import dotenv from "dotenv";
import authRouter from "./routes/auth";

dotenv.config();

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const app = express();
app.use(express.json());

app.use("/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`process.env.JWT_SECRET: ${process.env.JWT_SECRET}`);
});
