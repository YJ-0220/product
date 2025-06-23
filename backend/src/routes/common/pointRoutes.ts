import express from "express";
import { authenticate, requiredBuyer } from "../../middleware/auth";
import { chargePoint, createPointChargeRequest, getPointChargeRequests, getUserPointHistory } from "../../controllers/pointController";

const router = express.Router();

// 기존 즉시 충전 (관리자용)
router.post("/charge", authenticate, requiredBuyer, chargePoint);

// 포인트 충전 신청 관련
router.post("/charge-request", authenticate, requiredBuyer, createPointChargeRequest);
router.get("/charge-requests", authenticate, requiredBuyer, getPointChargeRequests);

// 포인트 거래 내역 조회
router.get("/history", authenticate, getUserPointHistory);

export default router;