import express from "express";
import {
  getOrderCategories,
  getOrderSubCategories,
  getOrderRequestBoard,
  getOrderRequestById,
  createOrderRequest,
  updateOrderRequestStatus,
} from "../controllers/orderController";
import {
  createApplication,
  updateApplication,
  getApplicationsByOrder,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController";
import {
  authenticate,
  requiredAdmin,
  requiredSeller,
} from "../middleware/auth";

const router = express.Router();

// 카테고리 관련
router.get("/categories", getOrderCategories);
router.get("/categories/:categoryId/subcategories", getOrderSubCategories);

// 게시판용 주문서
router.get("/", getOrderRequestBoard);
router.get("/:id", getOrderRequestById);

// 구매자용 주문하기
router.post("/request", authenticate, createOrderRequest);

// 관리자 전용 주문 상태 변경
router.patch(
  "/request/:id/status",
  authenticate,
  requiredAdmin,
  updateOrderRequestStatus
);
router.put(
  "/applications/:applicationId",
  authenticate,
  requiredSeller,
  updateApplication
);
// 판매자용 신청 삭제
router.delete(
  "/applications/:applicationId",
  authenticate,
  requiredSeller,
  deleteApplication
);

// 판매자용 신청 관련
router.post(
  "/:orderRequestId/applications",
  authenticate,
  requiredSeller,
  createApplication
);
router.get("/:orderRequestId/applications", getApplicationsByOrder);
// 관리자용 신청 상태 변경
router.patch(
  "/applications/:applicationId/status",
  authenticate,
  requiredAdmin,
  updateApplicationStatus
);

export default router;
