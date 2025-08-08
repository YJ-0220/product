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
  adminDeleteOrderRequest,
} from "../controllers/orderController";
import {
  getOrderCategories,
  getOrderSubCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/categoryController";
import {
  createOrderApplication,
  getOrderApplicationsByOrder,
  updateOrderApplicationStatus,
  deleteOrderApplication,
  deleteAcceptedOrderApplication,
} from "../controllers/applicationController";
import {
  createOrderWorkSubmit,
  getOrderWorkList,
  getOrderWorkItem,
  updateOrderWorkItem,
  updateOrderWorkItemStatus,
} from "../controllers/workController";

const router = express.Router();

// 모든 라우트에 인증 필요
router.use(authenticate);

// ===== 카테고리 =====
router.get("/categories", getOrderCategories);
router.get("/categories/:categoryId/subcategories", getOrderSubCategories);
// 관리자 카테고리/서브카테고리 CRUD
router.post("/categories", requiredAdmin, createCategory);
router.put("/categories/:categoryId", requiredAdmin, updateCategory);
router.delete("/categories/:categoryId", requiredAdmin, deleteCategory);
router.post(
  "/categories/:categoryId/subcategories",
  requiredAdmin,
  createSubcategory
);
router.put(
  "/categories/:categoryId/subcategories/:subcategoryId",
  requiredAdmin,
  updateSubcategory
);
router.delete(
  "/categories/:categoryId/subcategories/:subcategoryId",
  requiredAdmin,
  deleteSubcategory
);

// ===== 주문서 상세 조회 =====
// 주문서 목록 조회 (게시판)
router.get("/", getOrderRequestBoard);
// 주문서 생성
router.post("/", requiredBuyer, createOrderRequest);

// ===== 작업물 (Work Items) =====
// 주의: 파라미터 라우트 `/:orderId`보다 위에서 정의해야 `/work` 가 가로채지지 않습니다
// 작업물 목록 조회 (판매자)
router.get("/work", requiredSeller, getOrderWorkList);
// 작업물 상세 조회
router.get("/work/:workItemId", getOrderWorkItem);
// 작업물 수정 (판매자)
router.patch("/work/:workItemId", requiredSeller, updateOrderWorkItem);
// 작업물 제출 (판매자)
router.post("/:orderId/work", requiredSeller, createOrderWorkSubmit);
// 작업물 상태 업데이트 (관리자)
router.patch(
  "/:orderId/work/:workItemId/status",
  requiredAdmin,
  updateOrderWorkItemStatus
);

// 주문서 상세 조회
router.get("/:orderId", getOrderRequestById);
// 주문서 상태 변경 (관리자)
router.patch("/:orderId", requiredAdmin, updateOrderRequestStatus);
// 주문서 완전 삭제 (관리자)
router.delete("/:orderId", requiredAdmin, adminDeleteOrderRequest);

// ===== 신청서 (Applications) =====
// 신청서 생성
router.post("/:orderId/applications", requiredSeller, createOrderApplication);
// 주문별 신청 목록 전체 조회
router.get(
  "/:orderId/applications",
  requiredSeller,
  getOrderApplicationsByOrder
);
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

export default router;
