import { useState } from "react";
import {
  getAllPointChargeRequests,
  getAllPointWithdrawRequests,
  updatePointChargeRequest,
  updatePointWithdrawRequest,
} from "@/api/admin";
import type {
  PointChargeRequest,
  PointWithdrawRequest,
} from "@/types/pointRequestTypes";
import { useLoading } from "./useLoading";

export const usePointManagement = () => {
  const [pointChargeRequests, setPointChargeRequests] = useState<
    PointChargeRequest[]
  >([]);
  const [pointWithdrawRequests, setPointWithdrawRequests] = useState<
    PointWithdrawRequest[]
  >([]);
  const { withLoading } = useLoading();

  // 충전 신청 목록 조회
  const fetchPointChargeRequests = async () => {
    try {
      const response = await withLoading(getAllPointChargeRequests);
      setPointChargeRequests(response.chargeRequests || []);
    } catch (error) {
      console.error("포인트 충전 신청 목록 조회 실패:", error);
      setPointChargeRequests([]);
    }
  };

  // 환전 신청 목록 조회
  const fetchPointWithdrawRequests = async () => {
    try {
      const response = await withLoading(getAllPointWithdrawRequests);
      setPointWithdrawRequests(response.withdrawRequests || []);
    } catch (error) {
      console.error("포인트 환전 신청 목록 조회 실패:", error);
      setPointWithdrawRequests([]);
    }
  };

  // 충전 신청 업데이트
  const handleChargeUpdate = async (
    requestId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await updatePointChargeRequest(requestId, status);
      alert(
        `포인트 충전 신청이 ${
          status === "approved" ? "승인" : "거절"
        }되었습니다.`
      );
      fetchPointChargeRequests();
    } catch (error) {
      console.error("포인트 충전 신청 처리 실패:", error);
      alert("처리에 실패했습니다.");
    }
  };

  // 환전 신청 업데이트
  const handleWithdrawUpdate = async (
    requestId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await updatePointWithdrawRequest(requestId, status);
      alert(
        `포인트 환전 신청이 ${
          status === "approved" ? "승인" : "거절"
        }되었습니다.`
      );
      fetchPointWithdrawRequests();
    } catch (error) {
      console.error("환전 신청 처리 실패:", error);
      alert("처리에 실패했습니다.");
    }
  };

  return {
    pointChargeRequests,
    pointWithdrawRequests,
    fetchPointChargeRequests,
    fetchPointWithdrawRequests,
    handleChargeUpdate,
    handleWithdrawUpdate,
  };
};
