import {
  createOrderApplication,
  deleteOrderApplication,
  updateOrderApplicationStatus,
  updateOrderStatus,
  deleteAcceptedOrderApplication,
} from "@/api/order";
import { useState } from "react";

export const useOrderApplication = () => {
  const [editingApplicationId, setEditingApplicationId] = useState<
    string | null
  >(null);
  const [updating, setUpdating] = useState(false);

  // 신청하기/취소하기
  const handleApplicationSubmit = async (
    e: React.FormEvent,
    orderId: string,
    setError: (error: string) => void,
    refreshData: () => void
  ) => {
    e.preventDefault();

    if (!orderId) return;

    try {
      const data = {
        proposedPrice: 0,
      };

      await createOrderApplication(orderId, data);

      // 신청 목록 새로고침
      refreshData();

      // 폼 초기화 및 닫기
      resetForm();
    } catch (error: any) {
      setError(error?.response?.data?.error || "신청 제출에 실패했습니다.");
    }
  };

  // 신청 수정 모드 취소
  const handleCancelEdit = () => {
    resetForm();
  };

  // 신청 삭제 (판매자용)
  const handleDeleteApplication = async (
    orderId: string,
    applicationId: string,
    refreshData: () => void
  ) => {
    await deleteOrderApplication(orderId, applicationId);
    refreshData();
  };

  // 간단한 신청 (입력 없이 바로 신청)
  const handleSimpleApplication = async (
    orderId: string,
    requiredPoints: number,
    refreshData: () => void
  ) => {
    if (updating) return; // 이미 처리 중이면 무시

    try {
      setUpdating(true);

      // 간단한 신청 데이터 생성
      const applicationData = {
        proposedPrice: requiredPoints,
      };

      // 신청 제출
      await createOrderApplication(orderId, applicationData);

      // 성공 메시지
      alert("신청되었습니다!");

      // 약간의 지연 후 데이터 새로고침 (백엔드 처리 시간 고려)
      setTimeout(() => {
        try {
          refreshData();
        } catch (error) {
          console.error("데이터 새로고침 실패:", error);
        }
      }, 500);
    } catch (error: any) {
      alert(error?.response?.data?.error || "신청에 실패했습니다.");
    } finally {
      setTimeout(() => {
        setUpdating(false);
      }, 1000); // 1초 후 버튼 다시 활성화
    }
  };

  // 주문 상태 변경 (관리자용)
  const handleOrderStatusUpdate = async (
    orderId: string,
    status: string,
    refreshData: () => void
  ) => {
    try {
      setUpdating(true);
      await updateOrderStatus(orderId, status);
      refreshData();
    } catch (error: any) {
    } finally {
      setUpdating(false);
    }
  };

  // 신청 상태 변경 (관리자용)
  const handleApplicationStatusUpdate = async (
    orderId: string,
    applicationId: string,
    newStatus: string,
    refreshData: () => void
  ) => {
    try {
      setUpdating(true);
      await updateOrderApplicationStatus(orderId, applicationId, newStatus);
      refreshData();

      setTimeout(() => {
        alert(
          newStatus === "accepted"
            ? "신청이 수락되었습니다."
            : "신청이 거절되었습니다."
        );
      }, 1000);
    } catch (error: any) {
    } finally {
      setUpdating(false);
    }
  };

  // 관리자용 승인된 신청서 삭제
  const handleDeleteAcceptedApplication = async (
    orderId: string,
    applicationId: string,
    refreshData: () => void
  ) => {
    try {
      setUpdating(true);
      await deleteAcceptedOrderApplication(orderId, applicationId);
      refreshData();

      setTimeout(() => {
        alert("승인된 신청서가 삭제되었습니다.");
      }, 1000);
    } catch (error: any) {
    } finally {
      setUpdating(false);
    }
  };

  // 폼 초기화
  const resetForm = () => {
    setEditingApplicationId(null);
  };

  return {
    editingApplicationId,
    updating,
    handleApplicationSubmit,
    handleCancelEdit,
    resetForm,
    setEditingApplicationId,
    handleDeleteApplication,
    handleSimpleApplication,
    handleOrderStatusUpdate,
    handleApplicationStatusUpdate,
    handleDeleteAcceptedApplication,
  };
};
