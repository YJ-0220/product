import express from "express";
import { getUsers } from "../controllers/userController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/me", authenticate, getUsers);

export default router;
