import api from "./axios";

export interface OrderRequestData {
  category_id: number;
  subcategory_id: number;
  title: string;
  description: string;
  desired_quantity: number;
  budget: number;
  deadline: string;
}

export const createOrderRequest = async (data: OrderRequestData) => {
  const res = await api.post("/buyer/order-request", data);
  return res.data;
}