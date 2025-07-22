import api from "./axios";

export const getMyOrderRequest = async () => {
  const response = await api.get("/my/order");
  return response.data;
};

export const getMyOrderApplication = async () => {
  const response = await api.get("/my/application");
  return response.data;
};
