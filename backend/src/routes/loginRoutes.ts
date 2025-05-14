import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { JWT_SECRET } from "../config/env";

const router = express.Router();

router.use(cookieParser());

router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (email === "test@test.com" && password === "test") {
    const token = jwt.sign({ email }, JWT_SECRET as string, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: true, maxAge: 3600000 });
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

router.get("/register", (req, res) => {
  res.send("register");
});

router.get("/remember", (req, res) => {
  res.send("remember");
});

export default router;
