import "./config/env";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`process.env.DATABASE_URL: ${process.env.DATABASE_URL}`);
});
