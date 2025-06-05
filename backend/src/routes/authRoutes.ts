import express from "express";
import { login, logout } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// router.post("/register", register); // 사용자가 회원가입할때 쓰기
router.post("/login", login);
router.post("/logout", authenticate, logout);

export default router;
