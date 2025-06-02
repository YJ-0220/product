import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const renderMenuItems = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <li>
              <button
                onClick={() => handleMenuClick("/admin")}
                className="w-full text-left px-4 py-2 hover:bg-gray-900"
              >
                대시보드
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick("/admin/users")}
                className="w-full text-left px-4 py-2 hover:bg-gray-900"
              >
                사용자 관리
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick("/admin/settings")}
                className="w-full text-left px-4 py-2 hover:bg-gray-900"
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
                onClick={() => handleMenuClick("/seller")}
                className="w-full text-left px-4 py-2 hover:bg-gray-900"
              >
                판매 현황
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick("/seller/products")}
                className="w-full text-left px-4 py-2 hover:bg-gray-900"
              >
                상품 관리
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick("/seller/orders")}
                className="w-full text-left px-4 py-2 hover:bg-gray-900"
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
                onClick={() => handleMenuClick("/buyer")}
                className="w-full text-left px-4 py-2 hover:bg-gray-900"
              >
                홈
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick("/buyer/orders")}
                className="w-full text-left px-4 py-2 hover:bg-gray-900"
              >
                주문 내역
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick("/buyer/cart")}
                className="w-full text-left px-4 py-2 hover:bg-gray-900"
              >
                장바구니
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick("/membership")}
                className="w-full text-left px-4 py-2 hover:bg-gray-900"
              >
                멤버십
              </button>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static
          top-0 left-0
          h-full
          w-64
          bg-[#5745f8]
          border-r border-gray-700
          z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <nav className="py-4">
          <ul className="space-y-2">
            {renderMenuItems()}
            <li className="mt-4">
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-900"
              >
                로그아웃
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
