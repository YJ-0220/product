import express from "express";
import { authenticate, requiredAdmin } from "../middleware/auth";
import {
  getKPIChartData,
  adminRegister,
  createAdmin,
  adminDeleteUser,
  getAllUserList,
  getAllPointChargeRequests,
  updatePointChargeRequestStatus,
  updatePointWithdrawRequestStatus,
  getAllPointWithdrawRequests,
  getAllPointTransactions,
  adminRestoreUser,
  adminDeleteUserHard,
} from "../controllers/adminController";
import {
  adminChargePoint,
  adminChargeUserPoint,
} from "../controllers/pointController";

const router = express.Router();

// 모든 라우트에 관리자 인증 필요
router.use(authenticate, requiredAdmin);

// 대시보드
router.get("/kpi-chart-data", getKPIChartData);

// 관리자용 사용자 생성/관리자 생성
router.post("/register", adminRegister);
router.post("/create", createAdmin);

// 사용자 관리/삭제
router.get("/users", getAllUserList);
router.delete("/users/:userId", adminDeleteUser);
router.put("/users/:userId/restore", adminRestoreUser);
router.delete("/users/:userId/hard", adminDeleteUserHard);

// 포인트 충전 신청 관리/승인,거절
router.get("/points/charge-requests", getAllPointChargeRequests);
router.put(
  "/points/charge-requests/:requestId",
  updatePointChargeRequestStatus
);

// 포인트 환전 신청 관리/승인,거절
router.get("/points/withdraw-requests", getAllPointWithdrawRequests);
router.put(
  "/points/withdraw-requests/:requestId",
  updatePointWithdrawRequestStatus
);

// 전체 포인트 거래 내역 조회
router.get("/points/transactions", getAllPointTransactions);

// 관리자 포인트 충전/사용자 포인트 충전
router.post("/charge", adminChargePoint);
router.post("/users/:userId/charge", adminChargeUserPoint);

export default router;
