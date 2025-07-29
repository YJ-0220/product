import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/hooks/store/useAuthStore";
import { getOrderWorkItem } from "@/api/order";
import type { WorkItemData } from "@/types/orderTypes";

export const useWorkDetail = () => {
  const { workItemId } = useParams<{ workItemId: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [workItem, setWorkItem] = useState<WorkItemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchWorkDetail = async () => {
      if (!workItemId) {
        setError("작업물 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        try {
          const workItemData: WorkItemData = await getOrderWorkItem(workItemId);
          setWorkItem(workItemData);
        } catch (error: any) {
          console.error("API Error:", error);
          setError(
            "작업물을 찾을 수 없습니다: " +
              (error?.response?.data?.error || error.message)
          );
        }
      } catch (error: any) {
        setError(
          "데이터를 불러올 수 없습니다: " +
            (error?.response?.data?.error || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkDetail();
  }, [workItemId]);

  const handleBack = () => {
    if (user?.role === "seller") {
      navigate("/order/work");
    } else {
      navigate(-1);
    }
  };

  return {
    workItem,
    loading,
    error,
    user,
    handleBack,
  };
};
