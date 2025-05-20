import { Router, RequestHandler } from "express";
import { register, login, logout } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", register as RequestHandler);
router.post("/login", login as RequestHandler);
router.post("/logout", logout as RequestHandler);

export default router;
