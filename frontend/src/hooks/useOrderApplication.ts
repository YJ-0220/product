import {
  createOrderApplication,
  deleteApplication,
  updateApplicationStatus,
  updateOrderStatus,
  deleteAcceptedApplication,
} from "@/api/order";
import { useState } from "react";
import type { ApplicationData } from "@/types/orderTypes";

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
        message: "",
        proposedPrice: 0,
        estimatedDelivery: "",
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
    applicationId: string,
    orderId: string,
    refreshData: () => void
  ) => {
    await deleteApplication(orderId, applicationId);
    refreshData();
  };

  // 간단한 신청 (입력 없이 바로 신청)
  const handleSimpleApplication = async (
    orderId: string,
    requiredPoints: number,
    currentApplications: ApplicationData[],
    currentUserId: string,
    refreshData: () => void
  ) => {
    try {
      // 이미 신청했는지 확인
      const hasApplied = currentApplications.some(
        (app) => app.sellerId === currentUserId
      );

      if (hasApplied) {
        alert("이미 신청한 주문입니다.");
        return;
      }

      // 간단한 신청 데이터 생성
      const applicationData = {
        message: "신청합니다.",
        proposedPrice: requiredPoints,
      };

      // 신청 제출
      await createOrderApplication(orderId, applicationData);

      // 성공 메시지
      alert("신청되었습니다!");

      // 데이터 새로고침
      refreshData();
    } catch (error: any) {
      alert(error?.response?.data?.error || "신청에 실패했습니다.");
    }
  };

  // 주문 상태 변경 (관리자용)
  const handleOrderStatusUpdate = async (
    orderId: string,
    newStatus: string,
    refreshData: () => void
  ) => {
    try {
      setUpdating(true);
      await updateOrderStatus(orderId, newStatus);
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
      await updateApplicationStatus(orderId, applicationId, newStatus);
      refreshData();
      
      // 성공 메시지
      setTimeout(() => {
        alert(newStatus === 'accepted' ? '신청이 수락되었습니다.' : '신청이 거절되었습니다.');
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
      await deleteAcceptedApplication(orderId, applicationId);
      refreshData();
      alert("승인된 신청서가 삭제되었습니다.");
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
