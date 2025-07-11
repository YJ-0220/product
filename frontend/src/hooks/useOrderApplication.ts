import {
  createOrderApplication,
  deleteApplication,
  getApplicationsByOrder,
  editOrderApplication,
} from "@/api/order";
import { useState } from "react";
import type { ApplicationData } from "@/types/orderTypes";

export const useOrderApplication = () => {
  const [editingApplicationId, setEditingApplicationId] = useState<
    string | null
  >(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);

  // 신청하기/취소하기
  const handleApplicationSubmit = async (
    e: React.FormEvent,
    orderId: string,
    setError: (error: string) => void
  ) => {
    e.preventDefault();

    if (!orderId) return;

    try {
      const data = {
        message: "",
        proposedPrice: 0,
        estimatedDelivery: "",
      };

      if (editingApplicationId) {
        await editOrderApplication(orderId, editingApplicationId, data);
      } else {
        await createOrderApplication(orderId, data);
      }

      // 신청 목록 새로고침
      const applicationsData = await getApplicationsByOrder(orderId);
      setApplications(applicationsData.applications);

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

  // 신청 삭제
  const handleDeleteApplication = async (
    applicationId: string,
    orderId: string
  ) => {
    await deleteApplication(orderId, applicationId);
    const applicationsData = await getApplicationsByOrder(orderId);
    setApplications(applicationsData.applications);
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

  // 폼 초기화
  const resetForm = () => {
    setEditingApplicationId(null);
  };

  // 신청 상태 관련 유틸리티
  const getApplicationStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "검토중";
      case "accepted":
        return "수락됨";
      case "rejected":
        return "거절됨";
      case "cancelled":
        return "취소됨";
      default:
        return status;
    }
  };

  return {
    // 상태
    editingApplicationId,
    applications,
    // 액션
    handleApplicationSubmit,
    handleCancelEdit,
    resetForm,
    setEditingApplicationId,
    handleDeleteApplication,
    handleSimpleApplication,

    // 유틸리티
    getApplicationStatusBadgeClass,
    getApplicationStatusText,
  };
};
