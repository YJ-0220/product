import { useAuthStore } from "@/hooks/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { useOrderBoard } from "@/hooks/useOrderBoard";
import { useState } from "react";

const OrderBoardTitles = [
  {
    id: 1,
    title: "번호",
  },
  {
    id: 2,
    title: "작성자",
  },
  {
    id: 3,
    title: "작성일",
  },
  {
    id: 4,
    title: "제목",
  },
  {
    id: 5,
    title: "카테고리",
  },
  {
    id: 6,
    title: "신청",
  },
  {
    id: 7,
    title: "상태",
  },
];

export default function OrderBoard() {
  const { orders, getStatusText, getStatusColor } = useOrderBoard();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<
    "all" | "no-applications" | "has-applications" | "in-progress" | "completed"
  >("all");

  const filteredOrders = orders.filter((order) => {
    if (filter === "no-applications") {
      return !order.applications || order.applications.length === 0;
    }
    if (filter === "has-applications") {
      return (
        order.applications &&
        order.applications.length > 0 &&
        order.applications.some((app) => app.status === "pending") &&
        order.status === "pending"
      );
    }
    if (filter === "in-progress") {
      return (
        order.status === "progress" &&
        order.applications &&
        order.applications.some((app) => app.status === "accepted")
      );
    }
    if (filter === "completed") {
      return order.status === "completed";
    }
    return true;
  });

  return (
    <div className="px-10 py-4">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">주문서 게시판</h1>
            <p className="text-gray-600 mt-2">
              생성된 주문서 목록을 확인할 수 있습니다.
            </p>
          </div>

          {user?.role === "buyer" && (
            <Link
              to="/order/request"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              주문하기
            </Link>
          )}
        </div>

        {user?.role === "admin" && (
          <div className="flex items-center space-x-4 my-4">
            <span className="text-sm font-medium text-gray-700">필터:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === "all"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                전체 ({orders.length})
              </button>
              <button
                onClick={() => setFilter("no-applications")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === "no-applications"
                    ? "bg-gray-100 text-gray-800 border border-gray-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                신청 대기 (
                {
                  orders.filter(
                    (order) =>
                      !order.applications || order.applications.length === 0
                  ).length
                }
                )
              </button>
              <button
                onClick={() => setFilter("has-applications")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === "has-applications"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                신청 있음 (
                {
                  orders.filter(
                    (order) =>
                      order.applications &&
                      order.applications.some(
                        (app) => app.status === "pending"
                      ) &&
                      order.status === "pending"
                  ).length
                }
                )
              </button>
              <button
                onClick={() => setFilter("in-progress")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === "in-progress"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                작업 진행 중 (
                {
                  orders.filter(
                    (order) =>
                      order.status === "progress" &&
                      order.applications &&
                      order.applications.some(
                        (app) => app.status === "accepted"
                      )
                  ).length
                }
                )
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === "completed"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                완료 (
                {orders.filter((order) => order.status === "completed").length})
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {OrderBoardTitles.map((title) => (
                  <th
                    key={title.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {title.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {filter === "all"
                      ? "등록된 주문서가 없습니다."
                      : filter === "no-applications"
                      ? "신청 대기 중인 주문이 없습니다."
                      : filter === "has-applications"
                      ? "신청이 있는 주문이 없습니다."
                      : filter === "in-progress"
                      ? "작업 진행 중인 주문이 없습니다."
                      : "완료된 주문이 없습니다."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => {
                  const hasApplications = (order.applications?.length || 0) > 0;
                  const hasPendingApplications = order.applications?.some(
                    (app) => app.status === "pending"
                  );

                  return (
                    <tr
                      key={order.id}
                      className={`cursor-pointer transition-colors ${
                        hasApplications
                          ? hasPendingApplications
                            ? "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-l-yellow-400"
                            : "bg-green-50 hover:bg-green-100 border-l-4 border-l-green-400"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        navigate(`/order/${order.id}`);
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {filteredOrders.length - index}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.buyer?.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        <div className="font-medium">{order.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {order.category?.name ?? "삭제된 카테고리"}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mt-1">
                            {order.subcategory?.name ?? "삭제된 서브카테고리"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          const applicationCount =
                            order.applications?.length || 0;
                          const pendingCount =
                            order.applications?.filter(
                              (app) => app.status === "pending"
                            )?.length || 0;
                          const acceptedCount =
                            order.applications?.filter(
                              (app) => app.status === "accepted"
                            )?.length || 0;

                          if (applicationCount === 0) {
                            return (
                              <span className="text-gray-400 text-xs">
                                신청 없음
                              </span>
                            );
                          }

                          return (
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-700">
                                  총 {applicationCount}개
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs">
                                {pendingCount > 0 && (
                                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                    대기 {pendingCount}
                                  </span>
                                )}
                                {acceptedCount > 0 && (
                                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                    승인 {acceptedCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            이전
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
            1
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            다음
          </button>
        </nav>
      </div>
    </div>
  );
}
