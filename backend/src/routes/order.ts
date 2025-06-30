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
} from "../controllers/orderRequestController";
import { authenticate, requiredAdmin, requiredSeller } from "../middleware/auth";

const router = express.Router();

// 카테고리 관련
router.get("/categories", getCategories);
router.get("/categories/:categoryId/subcategories", getSubCategories);

// 게시판용 주문서
router.get("/", getOrders);
router.get("/:id", getOrderRequestById);

// 구매자용 주문하기
router.post("/request", authenticate, createOrderRequest);

// 관리자 전용 주문 상태 변경
router.patch("/request/:id/status", authenticate, requiredAdmin, updateOrderStatus);
router.put("/applications/:applicationId", authenticate, requiredAdmin, updateApplication);

// 판매자용 신청 관련
router.post("/:orderRequestId/applications", authenticate, requiredSeller, createApplication);
router.get("/:orderRequestId/applications", getApplicationsByOrder);
router.patch("/applications/:applicationId/status", authenticate, updateApplicationStatus);

export default router;