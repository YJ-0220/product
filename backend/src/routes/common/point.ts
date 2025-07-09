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
  getBanks,
} from "../../controllers/pointController";

const router = express.Router();

router.use(authenticate);

// 은행 목록 조회
router.get("/banks", getBanks);

// 포인트 충전 신청/환전 신청
router.post("/charge-requests", requiredBuyer, createPointChargeRequest);
router.post("/withdraw-requests", requiredSeller, createPointWithdrawRequest);

// 포인트 충전 신청 조회/환전 신청 조회
router.get("/charge-requests", requiredBuyer, getPointChargeRequests);
router.get("/withdraw-requests", requiredSeller, getPointWithdrawRequests);

// 포인트 거래 내역 조회/환전 내역 조회
router.get("/history", getUserPointHistory);

export default router;
