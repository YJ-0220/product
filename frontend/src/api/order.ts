import api from "./axios";
import type {
  OrderCategory,
  OrderData,
  ApplicationData,
} from "../types/orderTypes";
import type { OrderRequestData, CreateApplicationData } from "@/types/formTypes";

export const createOrderRequest = async (data: OrderRequestData) => {
  const res = await api.post("/order", data);
  return res.data;
};

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

export const getCategories = async (): Promise<OrderCategory[]> => {
  const res = await api.get("/order/categories");
  return res.data;
};

export const getSubCategories = async (
  parentId: number
): Promise<OrderCategory[]> => {
  const res = await api.get(`/order/categories/${parentId}/subcategories`);
  return res.data;
};

export const getOrderById = async (orderId: string): Promise<OrderData> => {
  const res = await api.get(`/order/${orderId}`);
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

export const createApplication = async (
  orderId: string,
  data: CreateApplicationData
): Promise<ApplicationData> => {
  const res = await api.post(`/order/${orderId}/applications`, data);
  return res.data.application;
};

export const updateApplication = async (
  orderId: string,
  applicationId: string,
  data: CreateApplicationData
): Promise<ApplicationData> => {
  const res = await api.put(`/order/${orderId}/applications/${applicationId}`, data);
  return res.data.application;
};

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

export const updateApplicationStatus = async (
  orderId: string,
  applicationId: string,
  status: string
): Promise<ApplicationData> => {
  const res = await api.patch(`/order/${orderId}/applications/${applicationId}/status`, {
    status,
  });
  return res.data.application;
};

export const deleteApplication = async (
  orderId: string,
  applicationId: string
): Promise<ApplicationData> => {
  const res = await api.delete(`/order/${orderId}/applications/${applicationId}`);
  return res.data.application;
};

// 작업물 제출
export const createWorkItem = async (data: {
  orderId: string;
  applicationId: string;
  description: string;
  workLink?: string;
  fileUrl?: string;
}) => {
  const res = await api.post(
    `/order/${data.orderId}/work`,
    data
  );
  return res.data;
};

// 현재 사용자의 승인된 신청서 조회
export const getAcceptedApplication = async (orderId: string) => {
  const res = await api.get(`/order/${orderId}/applications`, {
    params: { status: "accepted" }
  });
  return res.data.applications[0]; // 승인된 신청서는 하나만 있을 것
};

// 판매자의 모든 승인된 신청서 조회
export const getAcceptedApplications = async () => {
  const res = await api.get("/order/applications/accepted");
  return res.data.applications;
};
