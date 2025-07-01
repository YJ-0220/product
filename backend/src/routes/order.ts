import express from "express";
import {
  getCategories,
  getSubCategories,
  getOrders,
  getOrderRequestById,
  createOrderRequest,
  updateOrderStatus,
  createApplication,
  updateApplication,
  getApplicationsByOrder,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/orderRequestController";
import {
  authenticate,
  requiredAdmin,
  requiredSeller,
} from "../middleware/auth";

const router = express.Router();

// 모든 라우트에 인증 필요
router.use(authenticate);

// 카테고리 관련
router.get("/categories", getCategories);
router.get("/categories/:categoryId/subcategories", getSubCategories);

// 게시판용 주문서
router.get("/", getOrders);
router.get("/:id", getOrderRequestById);

// 구매자용 주문하기
router.post("/request", createOrderRequest);

// 관리자 전용 주문 상태 변경
router.patch("/request/:id/status", requiredAdmin, updateOrderStatus);
router.put("/applications/:applicationId", requiredAdmin, updateApplication);

// 판매자용 신청 관련
router.post("/:orderRequestId/applications", requiredSeller, createApplication);
router.get("/:orderRequestId/applications", getApplicationsByOrder);
router.patch("/applications/:applicationId/status", updateApplicationStatus);
router.delete(
  "/applications/:applicationId",
  requiredSeller,
  deleteApplication
);

export default router;
