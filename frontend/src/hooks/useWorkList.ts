import { useEffect, useState } from "react";
import type { WorkListData } from "@/types/orderTypes";
import { updateOrderWorkItemStatus } from "@/api/order";
import { getMyOrderApplication } from "@/api/myPage";
import { useLoading } from "./useLoading";

export const useWorkList = () => {
  const [acceptedOrder, setAcceptedOrder] = useState<WorkListData[]>([]);
  const [error, setError] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "in-progress">("all");

  const { loading, withLoading } = useLoading();
  // 작업 목록 조회
  useEffect(() => {
    const fetchWorkList = async () => {
      const data = await withLoading(getMyOrderApplication);

      // 신청 승인된 주문서만 필터링
      const acceptedOrder = (data.applications || []).filter(
        (app: any) => app.status === "accepted"
      );

      setAcceptedOrder(acceptedOrder);
    };

    fetchWorkList();
  }, []);

  const filteredApplications = acceptedOrder.filter((application) => {
    if (filter === "in-progress") {
      return (
        application.workItems.length > 0 &&
        application.orderRequest.status !== "completed"
      );
    }
    return true;
  });

  const handleStatusUpdate = async (
    applicationId: string,
    workItemId: string,
    status: string
  ) => {
    try {
      setUpdatingStatus(`${applicationId}`);
      await updateOrderWorkItemStatus(applicationId, workItemId, status);

      const data = await getMyOrderApplication();
      setAcceptedOrder(data.applications || []);
    } catch (error: any) {
      setError(error?.response?.data?.error || "상태 업데이트에 실패했습니다.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  return {
    acceptedOrder,
    filteredApplications,
    loading,
    error,
    updatingStatus,
    filter,
    setFilter,
    handleStatusUpdate,
  };
};
