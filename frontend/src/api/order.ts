import api from "./axios";
import type {
  OrderCategory,
  OrderData,
  ApplicationData,
} from "../types/orderTypes";
import type {
  OrderRequestData,
  CreateApplicationData,
} from "@/types/formTypes";
import type { WorkItemData } from "@/types/orderTypes";

// ===== 주문 관련 API =====

// 주문 생성
export const createOrderRequest = async (data: OrderRequestData) => {
  const res = await api.post("/order", data);
  return res.data;
};

// 주문 목록 조회 (주문 게시판용 - 모든 주문)
export const getOrderRequestBoard = async (params?: {
  page?: number;
  limit?: number;
  categoryId?: number;
  subcategoryId?: number;
  sortBy?: "latest" | "deadline" | "points";
}): Promise<{
  orders: OrderData[];
  total: number;
  page: number;
  limit: number;
}> => {
  const res = await api.get("/order", { params });
  return res.data;
};

// 주문 상세 조회
export const getOrderById = async (orderId: string): Promise<OrderData> => {
  const res = await api.get(`/order/${orderId}`);
  return res.data;
};

// 주문 삭제
export const deleteOrderRequest = async (orderId: string) => {
  const res = await api.delete(`/order/${orderId}`);
  return res.data;
};

// 주문 상태 업데이트
export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<OrderData> => {
  const res = await api.patch(`/order/${orderId}`, { status });
  return res.data.order;
};

// ===== 카테고리 관련 API =====

// 카테고리 조회
export const getCategories = async (): Promise<OrderCategory[]> => {
  const res = await api.get("/order/categories");
  return res.data;
};

// 서브카테고리 조회
export const getSubCategories = async (
  parentId: number
): Promise<OrderCategory[]> => {
  const res = await api.get(`/order/categories/${parentId}/subcategories`);
  return res.data;
};

// ===== 신청서 관련 API =====

// 신청서 생성
export const createOrderApplication = async (
  orderId: string,
  data: CreateApplicationData
): Promise<ApplicationData> => {
  const res = await api.post(`/order/${orderId}/applications`, data);
  return res.data.application;
};

// 주문별 신청서 조회
export const getOrderApplicationsByOrder = async (
  orderId: string,
  status?: string
): Promise<{
  applications: ApplicationData[];
}> => {
  const params = status ? { status } : {};
  const res = await api.get(`/order/${orderId}/applications`, {
    params,
  });
  return res.data;
};

// 신청서 상태 업데이트
export const updateApplicationStatus = async (
  applicationId: string,
  status: string
): Promise<ApplicationData> => {
  const res = await api.patch(`/order/applications/${applicationId}`, {
    status,
  });
  return res.data.application;
};

// 신청서 삭제
export const deleteApplication = async (
  applicationId: string
): Promise<ApplicationData> => {
  const res = await api.delete(`/order/applications/${applicationId}`);
  return res.data.application;
};

// 승인된 신청서(accepted) 관리자 삭제
export const deleteAcceptedApplication = async (applicationId: string) => {
  const res = await api.delete(`/order/applications/${applicationId}/accepted`);
  return res.data;
};

// 작업물 제출
export const createOrderWorkSubmit = async (
  applicationId: string,
  data: {
    description: string;
    workLink?: string;
    fileUrl?: string;
  }
) => {
  const res = await api.post(
    `/order/applications/${applicationId}/works`,
    data
  );
  return res.data;
};

// 작업물 목록 조회
export const getOrderWorkList = async (
  applicationId: string
): Promise<WorkItemData[]> => {
  const res = await api.get(`/order/applications/${applicationId}/works`);
  return res.data.workList;
};

// 작업물 상세 조회
export const getOrderWorkItem = async (
  applicationId: string,
  workItemId: string
): Promise<WorkItemData> => {
  const res = await api.get(
    `/order/applications/${applicationId}/works/${workItemId}`
  );
  return res.data.workItem;
};

// 작업물 수정
export const updateOrderWorkItem = async (
  applicationId: string,
  workItemId: string,
  data: {
    description?: string;
    workLink?: string;
    fileUrl?: string;
  }
) => {
  const res = await api.patch(
    `/order/applications/${applicationId}/works/${workItemId}`,
    data
  );
  return res.data;
};

// 작업물 상태 업데이트
export const updateOrderWorkItemStatus = async (
  applicationId: string,
  workItemId: string,
  status: string
) => {
  const res = await api.patch(
    `/order/applications/${applicationId}/works/${workItemId}/status`,
    { status }
  );
  return res.data;
};
