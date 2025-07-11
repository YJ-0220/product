import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrderRequestBoard } from "@/api/order";
import type { OrderData } from "@/types/orderTypes";
import { useAuth } from "@/context/AuthContext";
import { useUtils } from "@/hooks/useUtils";

interface OrderStats {
  pending: number;
  inProgress: number;
  completed: number;
}

export default function BuyerHome() {
  const { user } = useAuth();
  const { getStatusText, getStatusColor } = useUtils();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getOrderRequestBoard();
        setOrders(result.orders);

        const newStats = result.orders.reduce(
          (acc: OrderStats, order: OrderData) => {
            acc[order.status.toLowerCase() as keyof OrderStats]++;
            return acc;
          },
          { pending: 0, inProgress: 0, completed: 0 }
        );
        setStats(newStats);
      } catch (error) {
        console.error("주문 목록 조회 실패:", error);
      }
    };

    fetchOrders();
  }, []);



  return (
    <div className="px-8">
      <div className="bg-white rounded-lg shadow-md p-6 my-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">보유 포인트</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {user?.points?.toLocaleString() || 0}P
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/point/charge"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              포인트 충전 신청
            </Link>
            <Link
              to="/point/history"
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              충전 내역
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900">대기중</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900">진행중</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900">완료</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">최근 주문</h2>
          <Link
            to="/order"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            전체보기
          </Link>
        </div>
        <div className="space-y-4">
          {orders.slice(0, 3).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-900">{order.title}</h3>
                <p className="text-sm text-gray-500">
                  {order.category.name} &gt; {order.subcategory.name}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  마감일: {order.deadline ? new Date(order.deadline).toLocaleDateString() : "미정"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
