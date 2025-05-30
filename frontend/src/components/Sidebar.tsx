import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderMenuItems = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <li>
              <button
                onClick={() => navigate("/admin")}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                대시보드
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/admin/users")}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                사용자 관리
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/admin/settings")}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                설정
              </button>
            </li>
          </>
        );
      case "seller":
        return (
          <>
            <li>
              <button
                onClick={() => navigate("/seller")}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                판매 현황
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/seller/products")}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                상품 관리
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/seller/orders")}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                주문 관리
              </button>
            </li>
          </>
        );
      case "buyer":
        return (
          <>
            <li>
              <button
                onClick={() => navigate("/home")}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                홈
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/orders")}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                주문 내역
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/cart")}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                장바구니
              </button>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-64 h-full bg-blue-400 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">
          {role === "admin" && "관리자"}
          {role === "seller" && "판매자"}
          {role === "buyer" && "구매자"}
        </h1>
      </div>
      <nav className="py-4">
        <ul className="space-y-2">
          {renderMenuItems()}
          <li className="mt-8">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
            >
              로그아웃
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
