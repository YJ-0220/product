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
  const res = await api.post("/buyer/order-request", data);
  return res.data;
}

export const getCategories = async (): Promise<OrderCategory[]> => {
  const res = await api.get("/order-categories");
  return res.data;
}

export const getSubCategories = async (parentId: number): Promise<OrderCategory[]> => {
  const res = await api.get(`/order-categories/${parentId}/children`);
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
  createdAt: string;
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
}> => {
  const res = await api.get("/orders", { params });
  return res.data;
};