import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, getOrderApplicationsByOrder } from "@/api/order";
import { useAuth } from "@/context/AuthContext";
import type { OrderData, ApplicationData } from "@/types/orderTypes";

export const useOrderRequestDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

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
    user,
    refreshData,
    navigate,
    formatDate,
  };
};
