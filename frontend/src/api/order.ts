import api from "./axios";
import type {
  OrderCategory,
  OrderData,
  ApplicationData,
} from "../types/orderTypes";
import type { OrderRequestData, CreateApplicationData } from "@/types/formTypes";

export const createOrderRequest = async (data: OrderRequestData) => {
  const res = await api.post("/order/request", data);
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

export const getOrders = async (params?: {
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

export const getOrderById = async (id: string): Promise<OrderData> => {
  const res = await api.get(`/order/${id}`);
  return res.data;
};

// 주문 상태 업데이트
export const updateOrderStatus = async (
  id: string,
  status: string
): Promise<OrderData> => {
  const res = await api.patch(`/order/request/${id}/status`, { status });
  return res.data.order;
};

export const createApplication = async (
  orderRequestId: string,
  data: CreateApplicationData
): Promise<ApplicationData> => {
  const res = await api.post(`/order/${orderRequestId}/applications`, data);
  return res.data.application;
};

export const updateApplication = async (
  applicationId: string,
  data: CreateApplicationData
): Promise<ApplicationData> => {
  const res = await api.put(`/order/applications/${applicationId}`, data);
  return res.data.application;
};

export const getApplicationsByOrder = async (
  orderRequestId: string,
  status?: string
): Promise<{
  applications: ApplicationData[];
}> => {
  const params = status ? { status } : {};
  const res = await api.get(`/order/${orderRequestId}/applications`, {
    params,
  });
  return res.data;
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: string
): Promise<ApplicationData> => {
  const res = await api.patch(`/order/applications/${applicationId}/status`, {
    status,
  });
  return res.data.application;
};

export const deleteApplication = async (
  applicationId: string
): Promise<ApplicationData> => {
  const res = await api.delete(`/order/applications/${applicationId}`);
  return res.data.application;
};
