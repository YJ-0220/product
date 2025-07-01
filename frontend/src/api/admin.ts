import api from "./axios";

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const adminRegister = async (data: {
  username: string;
  password: string;
}) => {
  const response = await api.post("/admin/register", data);
  return response.data;
};

export const createAdmin = async (data: {
  username: string;
  password: string;
}) => {
  const response = await api.post("/admin/create", data);
  return response.data;
};

// 포인트 충전 신청 관련
export const getAllPointChargeRequests = async () => {
  const response = await api.get("/admin/points/charge-requests");
  return response.data;
};

// 포인트 환전 신청 관련
export const getAllPointWithdrawRequests = async () => {
  const response = await api.get("/admin/points/withdraw-requests");
  return response.data;
};

// 포인트 충전 신청 승인/거절
export const updatePointChargeRequest = async (
  requestId: string,
  status: "approved" | "rejected"
) => {
  const response = await api.put(`/admin/points/charge-requests/${requestId}`, {
    status,
  });
  return response.data;
};

// 포인트 환전 신청 승인/거절
export const updatePointWithdrawRequest = async (
  requestId: string,
  status: "approved" | "rejected"
) => {
  const response = await api.put(
    `/admin/points/withdraw-requests/${requestId}`,
    { status }
  );
  return response.data;
};

// 대시보드 통계 조회
export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard-stats");
  return response.data;
};

// 모든 사용자 조회
export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

// 사용자 역할 변경
export const updateUserRole = async (userId: string, role: string) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

// 사용자 삭제
export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/admin/users/${userId}/delete`);
  return response.data;
};

// 관리자용 포인트 충전 (사용자에게 직접 충전)
export const chargeUserPoint = async (
  userId: string,
  amount: number,
  description?: string
) => {
  const response = await api.post(`/admin/users/${userId}/charge`, {
    amount,
    description: description || "관리자 직접 충전",
  });
  return response.data;
};
