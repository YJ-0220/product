import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, getOrderApplicationsByOrder } from "@/api/order";
import { getOrderWorkList } from "@/api/order";
import { useAuth } from "@/context/AuthContext";
import type {
  OrderData,
  ApplicationData,
  WorkItemData,
} from "@/types/orderTypes";

export const useOrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [workItems, setWorkItems] = useState<WorkItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchData = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError("");

      // 주문 정보 조회
      const orderData = await getOrderById(orderId);
      setOrder(orderData);

      // 신청서 목록 조회
      const applicationsData = await getOrderApplicationsByOrder(orderId);
      setApplications(applicationsData);

      // 승인된 신청서의 작업물 상태 확인
      const acceptedApplications = applicationsData.filter(
        (app: ApplicationData) => app.status === "accepted"
      );

      const workItemStatuses = await Promise.allSettled(
        acceptedApplications.map(async (app: ApplicationData) => {
          try {
            const workItemData = await getOrderWorkList();
            return {
              applicationId: app.id,
              workItem: workItemData[0] || null,
              hasWorkItem: true,
            };
          } catch (error) {
            return {
              applicationId: app.id,
              workItem: null,
              hasWorkItem: false,
            };
          }
        })
      );

      const workItemsData = workItemStatuses.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value;
        } else {
          return {
            applicationId: acceptedApplications[index]?.id,
            workItem: null,
            hasWorkItem: false,
          };
        }
      });

      setWorkItems(
        workItemsData
          .map((item) => item.workItem)
          .filter((item) => item !== null) as WorkItemData[]
      );
    } catch (error: any) {
      setError(
        "데이터를 불러올 수 없습니다: " +
          (error?.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orderId]);

  const refreshData = () => {
    fetchData();
  };

  return {
    order,
    applications,
    workItems,
    loading,
    error,
    user,
    refreshData,
    navigate,
  };
};
