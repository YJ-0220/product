import express from "express";
import {
  adminRegister,
  getAdminDashboard,
  AdminDeleteUser,
  createAdmin,
} from "../controllers/adminController";
import { authenticate, requiredAdmin } from "../middleware/auth";

const router = express.Router();

router.get("/dashboard", authenticate, requiredAdmin, getAdminDashboard);
router.post("/register", authenticate, requiredAdmin, adminRegister);
router.post("/create-admin", authenticate, requiredAdmin, createAdmin);
router.delete("/users/:username", authenticate, requiredAdmin, AdminDeleteUser);

export default router;
