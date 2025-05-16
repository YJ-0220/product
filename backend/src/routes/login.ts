import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { JWT_SECRET } from "../config/env";
import prisma from "../lib/prisma";

const router = express.Router();

router.use(cookieParser());

router.post("/", (req, res) => {
  const { email, password } = req.body;

  // 테스트용 로그인
  if (email === "test@test.com" && password === "test") {
    const token = jwt.sign({ email }, JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// 로그아웃
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

// 회원가입
router.get("/register", (req, res) => {
  res.send("register");
});

// 아이디 유지
router.get("/remember", (req, res) => {
  res.send("remember");
});

export default router;
