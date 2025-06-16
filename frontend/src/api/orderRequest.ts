import api from "./axios";
import { type OrderCategory } from "../types/orderCategory";

export interface OrderRequestData {
  category_id: number;
  subcategory_id: number;
  title: string;
  description: string;
  desired_quantity: number;
  required_points: number;
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