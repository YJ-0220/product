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
  editOrderApplication,
  getOrderApplicationsByOrder,
  updateOrderApplicationStatus,
  deleteOrderApplication,
  getMyOrderApplications,
  deleteAcceptedOrderApplication,
} from "../controllers/applicationController";
import {
  createWorkItem,
  getWorkItemByOrderId,
  getWorkItems,
  createWorkProgress,
  getWorkProgress,
  updateWorkProgress,
} from "../controllers/workController";

const router = express.Router();

// 모든 라우트에 인증 필요
router.use(authenticate);

// ===== 카테고리(제일 먼저 배치) =====
router.get("/categories", getOrderCategories);
router.get("/categories/:categoryId/subcategories", getOrderSubCategories);

// ===== 주문서 기본 기능 =====
// 주문서 목록 조회 (게시판)
router.get("/", getOrderRequestBoard);
// 주문서 생성(주문하기)
router.post("/", requiredBuyer, createOrderRequest);
// 주문서 상세 조회
router.get("/:orderId", getOrderRequestById);
// 주문서 상태 변경 (관리자)
router.patch("/:orderId", requiredAdmin, updateOrderRequestStatus);

// ===== 신청서 (주문에 종속) =====
// 특정 주문의 신청서 목록 조회
router.get("/:orderId/applications", getOrderApplicationsByOrder);
// 신청서 생성
router.post("/:orderId/applications", requiredSeller, createOrderApplication);
// 신청서 수정(판매자)
router.put(
  "/:orderId/applications/:applicationId",
  requiredSeller,
  editOrderApplication
);
// 신청서 삭제(판매자)
router.delete(
  "/:orderId/applications/:applicationId",
  requiredSeller,
  deleteOrderApplication
);
// 신청서 상태 변경 (관리자)
router.patch(
  "/:orderId/applications/:applicationId/status",
  requiredAdmin,
  updateOrderApplicationStatus
);

// ===== 작업물 (승인된 신청서에만) =====
// 승인된 신청서에 작업물 제출(판매자)
router.post(
  "/:orderId/applications/:applicationId/work",
  requiredSeller,
  createWorkItem
);
// 작업물 조회
router.get("/:orderId/applications/:applicationId/work", getWorkItemByOrderId);

// ===== 작업 진행 상황 =====
// 작업 진행 상황 생성 (판매자)
router.post(
  "/:orderId/applications/:applicationId/work/progress",
  requiredSeller,
  createWorkProgress
);
// 작업 진행 상황 조회 (모든 사용자)
router.get(
  "/:orderId/applications/:applicationId/work/progress",
  getWorkProgress
);
// 작업 진행 상황 수정 (판매자)
router.put(
  "/:orderId/applications/:applicationId/work/progress",
  requiredSeller,
  updateWorkProgress
);

// ===== 사용자별 목록 =====
// 판매자: 내 승인된 신청서 목록
router.get("/my/applications", requiredSeller, getMyOrderApplications);
// 작업 목록 조회 (구매자/판매자 역할에 따라 다른 데이터)
router.get("/my/work", getWorkItems);

// 관리자만 접근 가능한 승인된 신청서 삭제 라우트
router.delete(
  "/:orderId/applications/:applicationId/accepted",
  requiredAdmin,
  deleteAcceptedOrderApplication
);

export default router;
