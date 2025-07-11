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
import type { CreateWorkProgressData } from "@/types/orderTypes";

// ===== 주문 관련 API =====

// 주문 생성
export const createOrderRequest = async (data: OrderRequestData) => {
  const res = await api.post("/order", data);
  return res.data;
};

// 주문 목록 조회
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
  const res = await api.patch(`/order/${orderId}/status`, { status });
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

// 신청서 수정
export const editOrderApplication = async (
  orderId: string,
  applicationId: string,
  data: CreateApplicationData
): Promise<ApplicationData> => {
  const res = await api.put(
    `/order/${orderId}/applications/${applicationId}`,
    data
  );
  return res.data.application;
};

// 주문별 신청서 조회
export const getApplicationsByOrder = async (
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
  orderId: string,
  applicationId: string,
  status: string
): Promise<ApplicationData> => {
  const res = await api.patch(
    `/order/${orderId}/applications/${applicationId}/status`,
    {
      status,
    }
  );
  return res.data.application;
};

// 신청서 삭제
export const deleteApplication = async (
  orderId: string,
  applicationId: string
): Promise<ApplicationData> => {
  const res = await api.delete(
    `/order/${orderId}/applications/${applicationId}`
  );
  return res.data.application;
};

// 현재 사용자의 승인된 신청서 조회
export const getAcceptedApplication = async (orderId: string) => {
  const res = await api.get(`/order/${orderId}/applications`, {
    params: { status: "accepted" },
  });
  return res.data.applications[0]; // 승인된 신청서는 하나만 있을 것
};

// 판매자의 승인된 신청서 목록 조회 (WorkItem이 없어도 표시)
export const getAcceptedApplicationsForWork = async () => {
  const res = await api.get("/order/my/applications");
  return res.data;
};

// 승인된 신청서(accepted) 관리자 삭제
export const deleteAcceptedApplication = async (applicationId: string) => {
  const res = await api.delete(`/order/applications/${applicationId}/accepted`);
  return res.data;
};

// ===== 작업물 관련 API =====

// 작업물 제출
export const createWorkItem = async (data: {
  orderId: string;
  applicationId: string;
  description: string;
  workLink?: string;
  fileUrl?: string;
}) => {
  const res = await api.post(
    `/order/${data.orderId}/applications/${data.applicationId}/work`,
    data
  );
  return res.data;
};

// 주문 ID로 WorkItem 조회
export const getWorkItemByOrderId = async (
  orderId: string,
  applicationId: string
) => {
  const res = await api.get(
    `/order/${orderId}/applications/${applicationId}/work`
  );
  return res.data;
};

// 작업 목록 조회 (구매자/판매자 역할에 따라 다른 데이터)
export const getWorkItems = async () => {
  const res = await api.get("/order/my/work");
  return res.data;
};

// ===== 작업 진행 상황 관련 API =====

// 작업 진행 상황 생성
export const createWorkProgress = async (
  data: CreateWorkProgressData & {
    orderId: string;
    applicationId: string;
  }
) => {
  const res = await api.post(
    `/order/${data.orderId}/applications/${data.applicationId}/work/progress`,
    data
  );
  return res.data;
};

// 작업 진행 상황 조회
export const getWorkProgress = async (
  orderId: string,
  applicationId: string
) => {
  const res = await api.get(
    `/order/${orderId}/applications/${applicationId}/work/progress`
  );
  return res.data;
};

// 작업 진행 상황 수정
export const updateWorkProgress = async (
  orderId: string,
  applicationId: string,
  progressId: string,
  data: Partial<CreateWorkProgressData>
) => {
  const res = await api.put(
    `/order/${orderId}/applications/${applicationId}/work/progress/${progressId}`,
    data
  );
  return res.data;
};
