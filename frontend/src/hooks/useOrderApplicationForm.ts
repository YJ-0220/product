import {
  createApplication,
  getApplicationsByOrder,
  updateApplication,
} from "@/api/order";
import { useState } from "react";
import type { ApplicationData } from "@/types/orderTypes";

export const useOrderApplicationForm = () => {
  const [applicationForm, setApplicationForm] = useState({
    message: "",
    proposedPrice: "",
    estimatedDelivery: "",
  });
  const [editingApplicationId, setEditingApplicationId] = useState<
    string | null
  >(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 신청 제출/수정
  const handleApplicationSubmit = async (
    e: React.FormEvent,
    orderId: string,
    setApplications: (applications: ApplicationData[]) => void,
    setError: (error: string) => void
  ) => {
    e.preventDefault();

    if (!orderId) return;

    try {
      setSubmitting(true);
      const data = {
        message: applicationForm.message || undefined,
        proposedPrice: applicationForm.proposedPrice
          ? Number(applicationForm.proposedPrice)
          : undefined,
        estimatedDelivery: applicationForm.estimatedDelivery || undefined,
      };

      if (editingApplicationId) {
        await updateApplication(editingApplicationId, data);
      } else {
        await createApplication(orderId, data);
      }

      // 신청 목록 새로고침
      const applicationsData = await getApplicationsByOrder(orderId);
      setApplications(applicationsData.applications);

      // 폼 초기화 및 닫기
      resetForm();
    } catch (error: any) {
      setError(error?.response?.data?.error || "신청 제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 신청 수정 모드 시작
  const handleEditApplication = (application: ApplicationData) => {
    setEditingApplicationId(application.id);
    setApplicationForm({
      message: application.message || "",
      proposedPrice: application.proposedPrice?.toString() || "",
      estimatedDelivery: application.estimatedDelivery
        ? new Date(application.estimatedDelivery).toISOString().split("T")[0]
        : "",
    });
    setShowApplicationForm(true);
  };

  // 신청 수정 모드 취소
  const handleCancelEdit = () => {
    resetForm();
  };

  // 폼 초기화
  const resetForm = () => {
    setApplicationForm({
      message: "",
      proposedPrice: "",
      estimatedDelivery: "",
    });
    setShowApplicationForm(false);
    setEditingApplicationId(null);
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    return (
      applicationForm.message.trim().length > 0 ||
      applicationForm.proposedPrice.trim().length > 0 ||
      applicationForm.estimatedDelivery.trim().length > 0
    );
  };

  // 신청 상태 관련 유틸리티
  const getApplicationStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "검토중";
      case "ACCEPTED":
        return "수락됨";
      case "REJECTED":
        return "거절됨";
      default:
        return status;
    }
  };

  return {
    // 상태
    applicationForm,
    editingApplicationId,
    showApplicationForm,
    submitting,

    // 액션
    setApplicationForm,
    handleApplicationSubmit,
    handleEditApplication,
    handleCancelEdit,
    resetForm,
    setShowApplicationForm,
    setEditingApplicationId,

    // 유틸리티
    isFormValid,
    getApplicationStatusBadgeClass,
    getApplicationStatusText,
  };
};
