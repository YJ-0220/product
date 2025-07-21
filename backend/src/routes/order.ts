import express from "express";
import {
  authenticate,
  requiredAdmin,
  requiredBuyer,
  requiredSeller,
} from "../middleware/auth";
import {
  getOrderRequestBoard,
  getOrderRequestById,
  createOrderRequest,
  updateOrderRequestStatus,
} from "../controllers/orderController";
import {
  getOrderCategories,
  getOrderSubCategories,
} from "../controllers/categoryController";
import {
  createOrderApplication,
  getOrderApplicationsByOrder,
  updateOrderApplicationStatus,
  deleteOrderApplication,
  deleteAcceptedOrderApplication,
} from "../controllers/applicationController";
import {
  createWorkSubmit,
  getWorkItemByOrderId,
  createWorkProgress,
  getWorkProgress,
  updateWorkProgress,
  updateWorkItem,
  updateWorkItemStatus,
} from "../controllers/workController";

const router = express.Router();

// 모든 라우트에 인증 필요
router.use(authenticate);

// ===== 카테고리 =====
router.get("/categories", getOrderCategories);
router.get("/categories/:categoryId/subcategories", getOrderSubCategories);

// ===== 주문서 (Orders) =====
// 주문서 목록 조회 (게시판)
router.get("/", getOrderRequestBoard);
// 주문서 생성
router.post("/", requiredBuyer, createOrderRequest);
// 주문서 상세 조회
router.get("/:orderId", getOrderRequestById);
// 주문서 상태 변경 (관리자)
router.patch("/:orderId", requiredAdmin, updateOrderRequestStatus);

// ===== 신청서 (Applications) =====
router.get("/:orderId/applications", getOrderApplicationsByOrder);
// 신청서 생성
router.post("/:orderId/applications", requiredSeller, createOrderApplication);
// 신청서 삭제 (승인 되기전에 판매자가 삭제 가능)
router.delete(
  "/:orderId/applications/:applicationId",
  requiredSeller,
  deleteOrderApplication
);
// 신청서 상태 변경 (관리자)
router.patch(
  "/:orderId/applications/:applicationId",
  requiredAdmin,
  updateOrderApplicationStatus
);
// 관리자용 승인된 신청서 삭제
router.delete(
  "/:orderId/applications/:applicationId/accepted",
  requiredAdmin,
  deleteAcceptedOrderApplication
);

// ===== 작업물 (Work Items) =====
// 작업물 제출 (판매자)
router.post(
  "/:orderId/applications/:applicationId/work/submit",
  requiredSeller,
  createWorkSubmit
);
// 작업물 조회
router.get("/:orderId/applications/:applicationId/work", getWorkItemByOrderId);
// 작업물 수정 (판매자)
router.patch(
  "/:orderId/applications/:applicationId/work",
  requiredSeller,
  updateWorkItem
);
// 작업물 상태 업데이트 (구매자)
router.patch(
  "/:orderId/applications/:applicationId/work/status",
  requiredBuyer,
  updateWorkItemStatus
);

// ===== 작업 진행 상황 (Work Progress) =====
// 작업 진행 상황 생성 (판매자)
router.post(
  "/:orderId/applications/:applicationId/progress",
  requiredSeller,
  createWorkProgress
);
// 작업 진행 상황 조회
router.get(
  "/:orderId/applications/:applicationId/progress",
  getWorkProgress
);
// 작업 진행 상황 수정 (판매자)
router.put(
  "/:orderId/applications/:applicationId/progress/:progressId",
  requiredSeller,
  updateWorkProgress
);

export default router;
