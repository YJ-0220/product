import express from "express";
import { authenticate, requiredAdmin } from "../middleware/auth";
import { 
  getAdminDashboard, 
  adminRegister, 
  createAdmin, 
  AdminDeleteUser,
  chargeUserPoint,
  getAllUsers
} from "../controllers/adminController";
import { 
  getAllPointChargeRequests, 
  updatePointChargeRequest 
} from "../controllers/pointController";

const router = express.Router();

// 모든 라우트에 관리자 인증 필요
router.use(authenticate, requiredAdmin);

// 대시보드
router.get("/dashboard", getAdminDashboard);

// 관리자 등록
router.post("/admin-register", adminRegister);
router.post("/create-admin", createAdmin);

// 사용자 관리
router.get("/users", getAllUsers);
router.delete("/users/:username", AdminDeleteUser);

// 포인트 충전 신청 관리
router.get("/point-charge-requests", getAllPointChargeRequests);
router.put("/point-charge-requests/:requestId", updatePointChargeRequest);

// 관리자용 포인트 충전 (사용자에게 직접 충전)
router.post("/users/:userId/charge-point", chargeUserPoint);

export default router;
