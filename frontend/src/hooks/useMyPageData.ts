import { useState, useEffect } from "react";
import { useAuthStore } from "@/hooks/store/useAuthStore";
import {
  getPointChargeRequests,
  getPointHistory,
  getPointWithdrawRequests,
} from "@/api/points";
import {
  getAllPointChargeRequests,
  getAllPointWithdrawRequests,
  getAllPointTransactions,
} from "@/api/admin";
import type {
  TabType,
  PointChargeRequest,
  PointWithdrawRequest,
  PointTransaction,
} from "@/types/myPageTypes";

export const useMyPageData = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [loading, setLoading] = useState(false);

  // 개별 사용자 데이터
  const [chargeRequests, setChargeRequests] = useState<PointChargeRequest[]>([]);
  const [withdrawRequests, setWithdrawRequests] = useState<PointWithdrawRequest[]>([]);
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>([]);

  // 관리자용 데이터
  const [allTransactions, setAllTransactions] = useState<PointTransaction[]>([]);
  const [adminChargeRequests, setAdminChargeRequests] = useState<PointChargeRequest[]>([]);
  const [adminWithdrawRequests, setAdminWithdrawRequests] = useState<PointWithdrawRequest[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (activeTab === "charge-history") {
        if (user?.role === "seller") {
          const response = await getPointWithdrawRequests();
          setWithdrawRequests(response.withdrawRequests);
        } else {
          const response = await getPointChargeRequests();
          setChargeRequests(response.chargeRequests);
        }
      } else if (activeTab === "points") {
        const response = await getPointHistory();
        setPointHistory(response.pointHistory);
      } else if (activeTab === "admin-approvals" && user?.role === "admin") {
        const [chargeResponse, withdrawResponse] = await Promise.all([
          getAllPointChargeRequests(),
          getAllPointWithdrawRequests(),
        ]);
        setAdminChargeRequests(chargeResponse.chargeRequests || []);
        setAdminWithdrawRequests(withdrawResponse.withdrawRequests || []);
      } else if (activeTab === "admin-transactions" && user?.role === "admin") {
        const response = await getAllPointTransactions();
        setAllTransactions(response.transactions || []);
      }
    } catch (error) {
      console.error("데이터 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      activeTab === "points" ||
      activeTab === "charge-history" ||
      activeTab === "admin-approvals" ||
      activeTab === "admin-transactions"
    ) {
      fetchData();
    }
  }, [activeTab, user?.role]);

  return {
    user,
    activeTab,
    setActiveTab,
    loading,
    fetchData,
    // 개별 사용자 데이터
    chargeRequests,
    withdrawRequests,
    pointHistory,
    // 관리자용 데이터
    allTransactions,
    adminChargeRequests,
    adminWithdrawRequests,
  };
};