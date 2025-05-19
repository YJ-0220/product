import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import pool from "../db/db";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.use(cookieParser());

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "존재하지 않는 아이디입니다." });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }
});

// 회원가입
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);
    res.status(201).json({ message: "회원가입 성공" });
  } catch (error) {
    res.status(500).json({ message: "회원가입 실패" });
  }
});

// 로그아웃
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

export default router;
