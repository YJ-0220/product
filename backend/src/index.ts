import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { env } from "./config/env";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import orderRoutes from "./routes/order";
import pointRoutes from "./routes/common/point";
import mypageRoutes from "./routes/common/myPage";
import contentRoutes from "./routes/content";

// Prisma Client 초기화
export const prisma = new PrismaClient();

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
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
app.use("/api/my", mypageRoutes);
app.use("/api/contents", contentRoutes);

// 서버 시작 시 Prisma 연결 확인
prisma.$connect()
  .then(() => {
    console.log("Successfully connected to database");
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
      console.log(`Client URL: ${env.CLIENT_URL}`);
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
