import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useOrderBoard } from "@/hooks/useOrderBoard";

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
    title: "상태",
  },
];

export default function OrderBoard() {
  const { orders, getStatusText, getStatusColor } = useOrderBoard();
  const { user } = useAuth();
  const navigate = useNavigate();

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

          {(user?.role === "buyer" || user?.role === "admin") && (
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
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    등록된 주문서가 없습니다.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      navigate(`/order/${order.id}`);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {orders.length - index}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.buyer.username}
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
                          {order.category.name}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mt-1">
                          {order.subcategory.name}
                        </span>
                      </div>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 (추후 구현) */}
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
