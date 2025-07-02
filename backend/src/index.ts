import "./config/env";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import orderRoutes from "./routes/order";
import pointRoutes from "./routes/common/point";

// Prisma Client 초기화
export const prisma = new PrismaClient();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/points", pointRoutes);

// 서버 시작 시 Prisma 연결 확인
prisma.$connect()
  .then(() => {
    console.log("Successfully connected to database");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });

// 서버 종료 시 Prisma 연결 종료
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
