import express from "express";
import { 
  getCategories, 
  getSubCategories,
  getOrderRequests, 
  getOrderRequestById,
  createOrderRequest,
  updateOrderStatus,
  createApplication,
  getApplicationsByOrder,
  updateApplicationStatus
} from "../controllers/orderRequestController";
import { authenticate, requiredAdmin, requiredSeller } from "../middleware/auth";

const router = express.Router();

// 카테고리 관련
router.get("/categories", getCategories);
router.get("/categories/:parentId/children", getSubCategories);

// 주문 관련
router.post("/request", authenticate, createOrderRequest);
router.get("/", authenticate, getOrderRequests);
router.get("/:id", authenticate, getOrderRequestById);

// 관리자 전용 - 주문 상태 변경
router.patch("/:id/status", authenticate, requiredAdmin, updateOrderStatus);

// 판매자 신청 관련
router.post("/:orderRequestId/applications", authenticate, requiredSeller, createApplication);
router.get("/:orderRequestId/applications", authenticate, getApplicationsByOrder);
router.patch("/applications/:applicationId/status", authenticate, updateApplicationStatus);

export default router;