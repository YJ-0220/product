import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const renderProfileSection = () => {
    const membershipLevel = role === "buyer" ? "GOLD" : null;
    
    return (
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
          <div>
            <h2 className="text-white font-semibold">홍길동</h2>
            <p className="text-gray-400 text-sm">
              {role === "admin" && "관리자"}
              {role === "seller" && "판매자"}
              {role === "buyer" && "구매자"}
            </p>
          </div>
        </div>
        {membershipLevel && (
          <div className="bg-gray-800 rounded-lg p-2 text-center">
            <span className="text-yellow-400 font-semibold">{membershipLevel} 멤버십</span>
          </div>
        )}
      </div>
    );
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
          bg-black
          border-r border-gray-700
          z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {renderProfileSection()}
        <nav className="py-4">
          <ul className="space-y-2">
            {renderMenuItems()}
            <li className="mt-8">
              <button
                onClick={handleLogout}
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
