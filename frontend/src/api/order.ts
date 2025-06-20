import api from "./axios";
import { type OrderCategory } from "../types/orderCategory";

export interface OrderRequestData {
  categoryId: number;
  subcategoryId: number;
  title: string;
  description: string;
  desiredQuantity: number;
  requiredPoints: number;
  deadline: string;
}

export const createOrderRequest = async (data: OrderRequestData) => {
  const res = await api.post("/order/request", data);
  return res.data;
}

export const getCategories = async (): Promise<OrderCategory[]> => {
  const res = await api.get("/order/categories");
  return res.data;
}

export const getSubCategories = async (parentId: number): Promise<OrderCategory[]> => {
  const res = await api.get(`/order/categories/${parentId}/children`);
  return res.data;
}

export interface OrderData {
  id: string;
  categoryId: number;
  subcategoryId: number;
  title: string;
  description: string;
  desiredQuantity: number;
  requiredPoints: number;
  deadline: string;
  createdAt: string;
  buyerId: string;
  buyer: {
    name: string;
  };
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  categoryId?: number;
  subcategoryId?: number;
  sortBy?: 'latest' | 'deadline' | 'points';
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

export const updateOrderStatus = async (id: string, status: string): Promise<OrderData> => {
  const res = await api.patch(`/order/${id}/status`, { status });
  return res.data.order;
};

// 판매자 신청 관련 타입과 API
export interface ApplicationData {
  id: string;
  orderRequestId: string;
  sellerId: string;
  message?: string;
  proposedPrice?: number;
  estimatedDelivery?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  seller: {
    name: string;
  };
}

export interface CreateApplicationData {
  message?: string;
  proposedPrice?: number;
  estimatedDelivery?: string;
}

export const createApplication = async (orderRequestId: string, data: CreateApplicationData): Promise<ApplicationData> => {
  const res = await api.post(`/order/${orderRequestId}/applications`, data);
  return res.data.application;
};

export const getApplicationsByOrder = async (orderRequestId: string, status?: string): Promise<{
  applications: ApplicationData[];
}> => {
  const params = status ? { status } : {};
  const res = await api.get(`/order/${orderRequestId}/applications`, { params });
  return res.data;
};

export const updateApplicationStatus = async (applicationId: string, status: string): Promise<ApplicationData> => {
  const res = await api.patch(`/order/applications/${applicationId}/status`, { status });
  return res.data.application;
};