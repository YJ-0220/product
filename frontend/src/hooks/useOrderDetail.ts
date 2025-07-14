import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  updateOrderStatus,
  getOrderApplicationsByOrder,
  updateApplicationStatus,
  deleteAcceptedApplication,
} from "@/api/order";
import { useAuth } from "@/context/AuthContext";
import type { OrderData, ApplicationData } from "@/types/orderTypes";

export const useOrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [updating, setUpdating] = useState(false);

  // 데이터 로드
  useEffect(() => {
    if (!orderId) {
      setError("주문 ID가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [orderData, applicationsData] = await Promise.all([
          getOrderById(orderId),
          getOrderApplicationsByOrder(orderId),
        ]);
        setOrder(orderData);
        setApplications(applicationsData.applications);
      } catch (error: any) {
        setError(
          error?.response?.data?.error || "데이터를 불러오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  // 주문 상태 변경 (관리)
  const handleOrderStatusUpdate = async (newStatus: string) => {
    if (!order || !orderId) return;
    try {
      setUpdating(true);
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrder(updatedOrder);
    } catch (error: any) {
      setError(error?.response?.data?.error || "상태 변경에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  // 신청 상태 변경 (관리자)
  const handleApplicationStatusUpdate = async (
    orderId: string,
    applicationId: string,
    newStatus: string
  ) => {
    try {
      setUpdating(true);
      await updateApplicationStatus(orderId, applicationId, newStatus);
      if (orderId) {
        const [orderData, applicationsData] = await Promise.all([
          getOrderById(orderId),
          getOrderApplicationsByOrder(orderId),
        ]);
        setOrder(orderData);
        setApplications(applicationsData.applications);
      }
      setTimeout(() => {
        alert(
          newStatus === "accepted"
            ? "신청이 수락되었습니다. 주문이 진행중 상태로 변경되었습니다."
            : "신청이 거절되었습니다."
        );
        navigate("/order");
      }, 1000);
    } catch (error: any) {
      setError(
        error?.response?.data?.error || "신청 상태 변경에 실패했습니다."
      );
    } finally {
      setUpdating(false);
    }
  };

  // 관리자용 승인된 신청서 삭제
  const handleDeleteAcceptedApplication = async (applicationId: string) => {
    try {
      setUpdating(true);
      await deleteAcceptedApplication(orderId!, applicationId);
      await refreshData();
      alert("승인된 신청서가 삭제되었습니다.");
    } catch (error: any) {
      setError(error?.response?.data?.error || "삭제에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  // 데이터 새로고침
  const refreshData = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const [orderData, applicationsData] = await Promise.all([
        getOrderById(orderId),
        getOrderApplicationsByOrder(orderId),
      ]);
      setOrder(orderData);
      setApplications(applicationsData.applications);
    } catch (error: any) {
      setError(
        error?.response?.data?.error || "데이터 새로고침에 실패했습니다."
      );
    } finally {
      setLoading(false);
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
    order,
    applications,
    loading,
    error,
    updating,
    user,
    handleOrderStatusUpdate,
    handleApplicationStatusUpdate,
    handleDeleteAcceptedApplication,
    refreshData,
    navigate,
    formatDate,
  };
};
