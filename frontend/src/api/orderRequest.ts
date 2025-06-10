import api from "./axios";

export interface OrderRequestData {
  category: string;
  subCategory: string;
  title: string;
  description: string;
  desired_quantity: number;
  budget: number;
}

export const createOrderRequest = async (data: OrderRequestData) => {
  const res = await api.post("/orders", data);
  return res.data;
}