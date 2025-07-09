import express from "express";
import {
  getOrderCategories,
  getOrderSubCategories,
  getOrderRequestBoard,
  getOrderRequestById,
  createOrderRequest,
  updateOrderRequestStatus,
  createWorkItem,
} from "../controllers/orderController";
import {
  createApplication,
  updateApplication,
  getApplicationsByOrder,
  updateApplicationStatus,
  deleteApplication,
  getAcceptedApplications,
} from "../controllers/applicationController";
import {
  authenticate,
  requiredAdmin,
  requiredBuyer,
  requiredSeller,
} from "../middleware/auth";

const router = express.Router();

// 모든 라우트에 인증 필요
router.use(authenticate);

// ===== 카테고리 관련 =====
router.get("/categories", getOrderCategories);
router.get("/categories/:categoryId/subcategories", getOrderSubCategories);

// ===== 주문서 관련 =====
// 주문서 목록 조회 (게시판)
router.get("/", getOrderRequestBoard);
// 주문서 생성(주문하기)
router.post("/", requiredBuyer, createOrderRequest);
// 주문서 상세 조회
router.get("/:orderId", getOrderRequestById);
// 주문서 상태 변경 (관리자)
router.patch("/:orderId/status", requiredAdmin, updateOrderRequestStatus);

// ===== 신청서 관련 =====
// 특정 주문의 신청서 목록 조회
router.get("/:orderId/applications", getApplicationsByOrder);
// 신청서 생성
router.post("/:orderId/applications", requiredSeller, createApplication);
// 신청서 수정(판매자)
router.put("/:orderId/applications/:applicationId", requiredSeller, updateApplication);
// 신청서 삭제(판매자)
router.delete("/:orderId/applications/:applicationId", requiredSeller, deleteApplication);
// 신청서 상태 변경 (관리자)
router.patch("/:orderId/applications/:applicationId/status", requiredAdmin, updateApplicationStatus);

// ===== 작업물 관련 =====
// 신청된 작업물 제출(판매자)
router.post("/:orderId/work", requiredSeller, createWorkItem);

// 판매자의 승인된 신청서 목록 조회
router.get("/applications/accepted", requiredSeller, getAcceptedApplications);

export default router;
