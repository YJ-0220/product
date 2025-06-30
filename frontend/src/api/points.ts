import api from "./axios";

// 포인트 충전
export const chargePoint = async (amount: number) => {
  const response = await api.post("/points/charge", { amount });
  return response.data;
};

// 포인트 충전 신청
export const createPointChargeRequest = async (amount: number) => {
  const response = await api.post("/points/charge-request", { amount });
  return response.data;
};

// 포인트 충전 신청 목록 조회
export const getPointChargeRequests = async () => {
  const response = await api.get("/points/charge");
  return response.data;
};

// 포인트 환전 신청
export const createPointWithdrawRequest = async (data: {
  amount: number;
  bankName: string;
  accountNum: string;
}) => {
  const response = await api.post("/points/withdraw-request", data);
  return response.data;
};

// 포인트 환전 신청 목록 조회
export const getPointWithdrawRequests = async () => {
  const response = await api.get("/points/withdraw");
  return response.data;
};

// 포인트 거래 내역 조회
export const getPointHistory = async () => {
  const response = await api.get("/points/history");
  return response.data;
}; 