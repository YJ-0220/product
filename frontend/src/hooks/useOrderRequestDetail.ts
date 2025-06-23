import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrderStatus, type OrderData, createApplication, updateApplication, getApplicationsByOrder, updateApplicationStatus, type ApplicationData } from "@/api/order";
import { useAuth } from "@/context/AuthContext";

export const useOrderRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [editingApplicationId, setEditingApplicationId] = useState<string | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    message: "",
    proposedPrice: "",
    estimatedDelivery: "",
  });

  // 데이터 로드
  useEffect(() => {
    if (!id) {
      setError("주문 ID가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [orderData, applicationsData] = await Promise.all([
          getOrderById(id),
          getApplicationsByOrder(id),
        ]);
        setOrder(orderData);
        setApplications(applicationsData.applications);
      } catch (error: any) {
        setError(error?.response?.data?.error || "데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 주문 상태 변경
  const handleStatusUpdate = async (newStatus: string) => {
    if (!order || !id) return;

    try {
      setUpdating(true);
      const updatedOrder = await updateOrderStatus(id, newStatus);
      setOrder(updatedOrder);
    } catch (error: any) {
      setError(error?.response?.data?.error || "상태 변경에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  // 신청 제출/수정
  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setUpdating(true);
      const data = {
        message: applicationForm.message || undefined,
        proposedPrice: applicationForm.proposedPrice ? Number(applicationForm.proposedPrice) : undefined,
        estimatedDelivery: applicationForm.estimatedDelivery || undefined,
      };
      
      if (editingApplicationId) {
        await updateApplication(editingApplicationId, data);
      } else {
        await createApplication(id, data);
      }
      
      // 신청 목록 새로고침
      const applicationsData = await getApplicationsByOrder(id);
      setApplications(applicationsData.applications);
      
      // 폼 초기화 및 닫기
      setApplicationForm({ message: "", proposedPrice: "", estimatedDelivery: "" });
      setShowApplicationForm(false);
      setEditingApplicationId(null);
    } catch (error: any) {
      setError(error?.response?.data?.error || "신청 제출에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  // 신청 수정 모드 시작
  const handleEditApplication = (application: ApplicationData) => {
    setEditingApplicationId(application.id);
    setApplicationForm({
      message: application.message || "",
      proposedPrice: application.proposedPrice?.toString() || "",
      estimatedDelivery: application.estimatedDelivery ? new Date(application.estimatedDelivery).toISOString().split('T')[0] : "",
    });
    setShowApplicationForm(true);
  };

  // 신청 수정 모드 취소
  const handleCancelEdit = () => {
    setEditingApplicationId(null);
    setApplicationForm({ message: "", proposedPrice: "", estimatedDelivery: "" });
    setShowApplicationForm(false);
  };

  // 신청 상태 변경
  const handleApplicationStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      setUpdating(true);
      await updateApplicationStatus(applicationId, newStatus);
      
      // 신청 목록 새로고침
      if (id) {
        const applicationsData = await getApplicationsByOrder(id);
        setApplications(applicationsData.applications);
      }
    } catch (error: any) {
      setError(error?.response?.data?.error || "신청 상태 변경에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  // 유틸리티 함수들
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기중";
      case "IN_PROGRESS":
        return "진행중";
      case "COMPLETED":
        return "완료";
      case "CANCELLED":
        return "취소";
      default:
        return status;
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    // 상태
    order,
    applications,
    loading,
    error,
    updating,
    showApplicationForm,
    editingApplicationId,
    applicationForm,
    user,
    
    // 액션
    handleStatusUpdate,
    handleApplicationSubmit,
    handleEditApplication,
    handleCancelEdit,
    handleApplicationStatusUpdate,
    setShowApplicationForm,
    setApplicationForm,
    navigate,
    
    // 유틸리티
    getStatusBadgeClass,
    getStatusText,
    getApplicationStatusBadgeClass,
    getApplicationStatusText,
    formatDate,
  };
};