import express from "express";
import {
  adminRegister,
  getAdminDashboard,
  AdminDeleteUser,
  createAdmin,
} from "../controllers/adminController";
import { 
  getAllPointChargeRequests, 
  updatePointChargeRequest 
} from "../controllers/pointController";
import { authenticate, requiredAdmin } from "../middleware/auth";

const router = express.Router();

// 관리자 페이지
router.get("/dashboard", authenticate, requiredAdmin, getAdminDashboard);
router.post("/admin-register", authenticate, requiredAdmin, adminRegister);
router.post("/create-admin", authenticate, requiredAdmin, createAdmin);
router.delete("/users/:username", authenticate, requiredAdmin, AdminDeleteUser);

// 포인트 충전 신청 관리
router.get("/point-charge-requests", authenticate, requiredAdmin, getAllPointChargeRequests);
router.put("/point-charge-requests/:requestId", authenticate, requiredAdmin, updatePointChargeRequest);

export default router;
