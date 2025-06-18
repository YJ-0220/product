import { useEffect, useState } from "react";
import { getOrders, type OrderData } from "@/api/order";

export default function OrderBoard() {
  const [orders, setOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getOrders();
        setOrders(result.orders);
      } catch (error) {
        console.error("주문서 목록 조회 실패:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">주문서 목록</h1>

        {/* 주문서 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {order.category.name}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {order.subcategory.name}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    order.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : order.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status === "PENDING" && "대기중"}
                  {order.status === "IN_PROGRESS" && "진행중"}
                  {order.status === "COMPLETED" && "완료"}
                  {order.status === "CANCELLED" && "취소"}
                </span>
              </div>

              <h3 className="text-xl font-semibold mb-2">{order.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {order.description}
              </p>

              <div className="space-y-2 text-sm text-gray-500">
                <p>수량: {order.desiredQuantity.toLocaleString()}개</p>
                <p>포인트: {order.requiredPoints.toLocaleString()}P</p>
                <p>마감일: {new Date(order.deadline).toLocaleDateString()}</p>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {order.buyer.name}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
