import express from "express";
import {
  adminRegister,
  getAdminDashboard,
  AdminDeleteUser,
  createAdmin,
} from "../controllers/adminController";
import { authenticate } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";

const router = express.Router();

router.get("/dashboard", authenticate, requireAdmin, getAdminDashboard);
router.post("/register", authenticate, requireAdmin, adminRegister);
router.post("/create-admin", authenticate, requireAdmin, createAdmin);
router.delete("/users/:username", authenticate, requireAdmin, AdminDeleteUser);

export default router;
