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
  orderId: string,
  applicationId: string,
  status: string
): Promise<ApplicationData> => {
  const res = await api.patch(
    `/order/${orderId}/applications/${applicationId}`,
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

// 승인된 신청서(accepted) 관리자 삭제
export const deleteAcceptedApplication = async (
  orderId: string,
  applicationId: string
) => {
  const res = await api.delete(
    `/order/${orderId}/applications/${applicationId}/accepted`
  );
  return res.data;
};

// ===== 작업물 관련 API =====

// 파일 업로드
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/order/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// 작업물 제출
export const createWorkSubmit = async (data: {
  orderId: string;
  applicationId: string;
  description: string;
  workLink?: string;
  fileUrl?: string;
}) => {
  const res = await api.post(
    `/order/${data.orderId}/applications/${data.applicationId}/work/submit`,
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

// 작업물 수정
export const updateWorkItem = async (
  orderId: string,
  applicationId: string,
  data: {
    description?: string;
    workLink?: string;
    fileUrl?: string;
  }
) => {
  const res = await api.patch(
    `/order/${orderId}/applications/${applicationId}/work`,
    data
  );
  return res.data;
};

// 작업물 상태 업데이트
export const updateWorkItemStatus = async (
  orderId: string,
  applicationId: string,
  status: string
) => {
  const res = await api.patch(
    `/order/${orderId}/applications/${applicationId}/work/status`,
    { status }
  );
  return res.data;
};

// ===== 작업 진행 상황 관련 API =====

// 작업 진행 상황 생성
export const createWorkProgress = async (
  data: Omit<CreateWorkProgressData, 'workItemId'> & {
    orderId: string;
    applicationId: string;
  }
) => {
  const res = await api.post(
    `/order/${data.orderId}/applications/${data.applicationId}/progress`,
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
    `/order/${orderId}/applications/${applicationId}/progress`
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
    `/order/${orderId}/applications/${applicationId}/progress/${progressId}`,
    data
  );
  return res.data;
};
