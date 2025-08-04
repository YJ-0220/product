import { useState, useCallback } from "react";
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
  const { withKeyLoading, isLoading } = useLoading();

  // 에러 메시지 추출 함수
  const getErrorMessage = useCallback((error: any): string => {
    return error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
  }, []);

  // 충전 신청 목록 조회
  const fetchPointChargeRequests = useCallback(async () => {
    try {
      await withKeyLoading('chargeRequests', async () => {
        const response = await getAllPointChargeRequests();
        setPointChargeRequests(response.chargeRequests || []);
      });
    } catch (error) {
      console.error("포인트 충전 신청 목록 조회 실패:", error);
      const errorMessage = getErrorMessage(error);
      alert(`충전 신청 목록 조회 실패: ${errorMessage}`);
      setPointChargeRequests([]);
    }
  }, [withKeyLoading, getErrorMessage]);

  // 환전 신청 목록 조회
  const fetchPointWithdrawRequests = useCallback(async () => {
    try {
      await withKeyLoading('withdrawRequests', async () => {
        const response = await getAllPointWithdrawRequests();
        setPointWithdrawRequests(response.withdrawRequests || []);
      });
    } catch (error) {
      console.error("포인트 환전 신청 목록 조회 실패:", error);
      const errorMessage = getErrorMessage(error);
      alert(`환전 신청 목록 조회 실패: ${errorMessage}`);
      setPointWithdrawRequests([]);
    }
  }, [withKeyLoading, getErrorMessage]);

  // 충전 신청 업데이트
  const handleChargeUpdate = useCallback(async (
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
      const errorMessage = getErrorMessage(error);
      alert(`충전 신청 처리 실패: ${errorMessage}`);
    }
  }, [fetchPointChargeRequests, getErrorMessage]);

  // 환전 신청 업데이트
  const handleWithdrawUpdate = useCallback(async (
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
      const errorMessage = getErrorMessage(error);
      alert(`환전 신청 처리 실패: ${errorMessage}`);
    }
  }, [fetchPointWithdrawRequests, getErrorMessage]);

  return {
    pointChargeRequests,
    pointWithdrawRequests,
    isLoadingChargeRequests: isLoading('chargeRequests'),
    isLoadingWithdrawRequests: isLoading('withdrawRequests'),
    fetchPointChargeRequests,
    fetchPointWithdrawRequests,
    handleChargeUpdate,
    handleWithdrawUpdate,
  };
};
