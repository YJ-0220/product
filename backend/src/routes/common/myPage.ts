import express from "express";
import { getMyOrderRequest } from "../../controllers/myPageController";
import {
  authenticate,
  requiredBuyer,
  requiredSeller,
} from "../../middleware/auth";
import { getWorkItems } from "../../controllers/workController";
import { getMyOrderApplications } from "../../controllers/applicationController";

const router = express.Router();

router.use(authenticate);

// ===== 사용자별 목록 =====
// 구매자: 내 주문 목록
router.get("/order", requiredBuyer, getMyOrderRequest);
// 판매자: 내 승인된 신청서 목록
router.get("/application", requiredSeller, getMyOrderApplications);
// 작업 목록 조회 (구매자/판매자 역할에 따라 다른 데이터)
router.get("/work", getWorkItems);

export default router;
