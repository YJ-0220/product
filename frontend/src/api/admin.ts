import api from "./axios";

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const adminRegister = async (data: {
  username: string;
  password: string;
}) => {
  const response = await api.post("/admin/admin-register", data);
  return response.data;
};

export const createAdmin = async (data: {
  username: string;
  password: string;
}) => {
  const response = await api.post("/admin/create-admin", data);
  return response.data;
};

export const deleteUser = async (username: string) => {
  const response = await api.delete(`/admin/users/${username}`);
  return response.data;
};

// 포인트 충전 신청 관련
export const getAllPointChargeRequests = async () => {
  const response = await api.get("/admin/point-charge-requests");
  return response.data;
};

// 포인트 충전 신청 승인/거절
export const updatePointChargeRequest = async (requestId: string, status: 'approved' | 'rejected') => {
  const response = await api.put(`/admin/point-charge-requests/${requestId}`, { status });
  return response.data;
};