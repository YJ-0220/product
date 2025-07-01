import express from "express";
import {
  authenticate,
  requiredBuyer,
  requiredSeller,
} from "../../middleware/auth";
import {
  createPointChargeRequest,
  getPointChargeRequests,
  getUserPointHistory,
  createPointWithdrawRequest,
  getPointWithdrawRequests,
} from "../../controllers/pointController";

const router = express.Router();

// 포인트 충전 신청/환전 신청
router.post("/charge-requests", authenticate, requiredBuyer, createPointChargeRequest);
router.post(
  "/withdraw-requests",
  authenticate,
  requiredSeller,
  createPointWithdrawRequest
);

// 포인트 충전 신청 조회/환전 신청 조회
router.get("/charge-requests", authenticate, requiredBuyer, getPointChargeRequests);
router.get("/withdraw-requests", authenticate, requiredSeller, getPointWithdrawRequests);

// 포인트 거래 내역 조회/환전 내역 조회
router.get("/history", authenticate, getUserPointHistory);

export default router;
