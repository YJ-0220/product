import { useEffect, useState } from "react";
import { useUtils } from "./useUtils";
import type { OrderData } from "@/types/orderTypes";
import { getOrderRequestBoard } from "@/api/order";
import { useLoading } from "./useLoading";

export const useOrderBoard = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const { loading, withLoading } = useLoading();
  const { getStatusText, getStatusColor } = useUtils();

  useEffect(() => {
    const fetchOrders = async () => {
      const result = await withLoading(getOrderRequestBoard);
      setOrders(result.orders);
    };

    fetchOrders();

    // 페이지 포커스 시 새로고침 (다른 페이지에서 돌아올 때)
    const handleFocus = () => {
      fetchOrders();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return { orders, loading, getStatusText, getStatusColor };
};
