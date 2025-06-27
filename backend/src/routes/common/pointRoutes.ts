import express from "express";
import { authenticate, requiredBuyer } from "../../middleware/auth";
import { 
  chargePoint, 
  createPointChargeRequest, 
  getPointChargeRequests, 
  getUserPointHistory,
  createPointWithdrawRequest,
  getPointWithdrawRequests
} from "../../controllers/pointController";

const router = express.Router();

// 기존 즉시 충전 (관리자용)
router.post("/charge", authenticate, requiredBuyer, chargePoint);

// 포인트 충전 신청 관련
router.post("/charge-request", authenticate, requiredBuyer, createPointChargeRequest);
router.get("/charge-requests", authenticate, getPointChargeRequests);

// 포인트 환전 신청 관련
router.post("/withdraw-request", authenticate, createPointWithdrawRequest);
router.get("/withdraw-requests", authenticate, getPointWithdrawRequests);

// 포인트 거래 내역 조회
router.get("/history", authenticate, getUserPointHistory);

export default router;