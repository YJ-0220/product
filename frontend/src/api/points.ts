import api from "./axios";

// 포인트 충전
export const chargePoint = async (amount: number) => {
  const response = await api.post("/points/charge", { amount });
  return response.data;
};

// 포인트 충전 신청
export const createPointChargeRequest = async (amount: number) => {
  const response = await api.post("/points/charge-requests", { amount });
  return response.data;
};

// 포인트 환전 신청
export const createPointWithdrawRequest = async (data: {
  amount: number;
  bankId: string;
  accountNum: string;
  accountHolderName: string;
}) => {
  const response = await api.post("/points/withdraw-requests", data);
  return response.data;
};

// 포인트 충전 신청 목록 조회
export const getPointChargeRequests = async () => {
  const response = await api.get("/points/charge-requests");
  return response.data;
};

// 포인트 환전 신청 목록 조회
export const getPointWithdrawRequests = async () => {
  const response = await api.get("/points/withdraw-requests");
  return response.data;
};

// 은행 목록 조회
export const getBanks = async () => {
  const response = await api.get("/points/banks");
  return response.data;
};

// 포인트 거래 내역 조회
export const getPointHistory = async () => {
  const response = await api.get("/points/history");
  return response.data;
};
