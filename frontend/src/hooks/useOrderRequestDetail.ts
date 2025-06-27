import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrderStatus, getApplicationsByOrder, updateApplicationStatus } from "@/api/order";
import { useAuth } from "@/context/AuthContext";
import { type OrderData, type ApplicationData } from "@/types/orderTypes";

export const useOrderRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [updating, setUpdating] = useState(false);

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

  // 주문 상태 변경 (관리자용)
  const handleOrderStatusUpdate = async (newStatus: string) => {
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

  // 신청 상태 변경 (구매자/관리자용)
  const handleApplicationStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      setUpdating(true);
      await updateApplicationStatus(applicationId, newStatus);
      
      // 신청 목록과 주문 정보 모두 새로고침
      if (id) {
        const [orderData, applicationsData] = await Promise.all([
          getOrderById(id),
          getApplicationsByOrder(id),
        ]);
        setOrder(orderData);
        setApplications(applicationsData.applications);
      }

      // 성공 메시지 표시 후 게시판으로 돌아가기
      setTimeout(() => {
        alert(newStatus === 'ACCEPTED' ? '신청이 수락되었습니다. 주문이 진행중 상태로 변경되었습니다.' : '신청이 거절되었습니다.');
        navigate('/order');
      }, 1000);
    } catch (error: any) {
      setError(error?.response?.data?.error || "신청 상태 변경에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  // 데이터 새로고침
  const refreshData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [orderData, applicationsData] = await Promise.all([
        getOrderById(id),
        getApplicationsByOrder(id),
      ]);
      setOrder(orderData);
      setApplications(applicationsData.applications);
    } catch (error: any) {
      setError(error?.response?.data?.error || "데이터 새로고침에 실패했습니다.");
    } finally {
      setLoading(false);
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
    user,
    
    // 액션
    handleOrderStatusUpdate,
    handleApplicationStatusUpdate,
    refreshData,
    navigate,
    
    // 유틸리티
    getStatusBadgeClass,
    getStatusText,
    formatDate,
  };
};