import api from "./axios";

export const chargePoint = async (amount: number) => {
  const response = await api.post("/points/charge", { amount });
  return response.data;
}; 