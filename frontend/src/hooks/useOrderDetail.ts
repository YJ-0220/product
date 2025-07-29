import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "@/api/order";
import { useAuthStore } from "@/hooks/store/useAuthStore";
import type {
  OrderData,
  ApplicationData,
  WorkItemData,
} from "@/types/orderTypes";
import { useLoading } from "./useLoading";

export const useOrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuthStore();
  const { withLoading } = useLoading();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [workItems, setWorkItems] = useState<WorkItemData[]>([]);
  const [error, setError] = useState<string>("");

  const fetchData = useCallback(async () => {
    if (!orderId) return;

    try {
      setError("");

      // 주문 정보 조회 (신청서와 작업물 정보 포함)
      const orderData: any = await withLoading(() => getOrderById(orderId));
      setOrder(orderData);

      // 주문 데이터에서 신청서 목록 추출
      const applicationsData = orderData.applications || [];
      setApplications(applicationsData);

      // 주문 데이터에서 작업물 정보 추출
      const allWorkItems: WorkItemData[] = [];
      applicationsData.forEach((app: any) => {
        if (app.workItems && app.workItems.length > 0) {
          allWorkItems.push(...app.workItems.map((workItem: any) => ({
            ...workItem,
            applicationId: app.id,
          })));
        }
      });
      
      setWorkItems(allWorkItems);
    } catch (error: any) {
      setError(
        "데이터를 불러올 수 없습니다: " +
          (error?.response?.data?.error || error.message)
      );
    }
  }, [orderId, withLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    order,
    applications,
    workItems,
    error,
    user,
    refreshData,
  };
};
