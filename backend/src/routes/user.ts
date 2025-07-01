import express from "express";
import { getUserProfile } from "../controllers/userController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/me", authenticate, getUserProfile);

export default router;
