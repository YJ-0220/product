import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Footer from "./Footer";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function Icon({ path }: { path: string }) {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={path}
      />
    </svg>
  );
}

const renderLink = (to: string, label: string, iconPath: string) => (
  <li>
    <Link
      aria-label={label}
      to={to}
      className="w-full flex items-center space-x-3 p-4 text-white hover:bg-gray-900 transition-colors"
    >
      <Icon path={iconPath} />
      <span>{label}</span>
    </Link>
  </li>
);

const renderDropdownLink = (to: string, label: string, iconPath?: string) => (
  <li>
    <Link
      aria-label={label}
      to={to}
      className="w-full flex items-center space-x-3 p-4 pl-8 text-white hover:bg-gray-900 transition-colors text-sm"
    >
      {iconPath && <Icon path={iconPath} />}
      <span>{label}</span>
    </Link>
  </li>
);

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const role = user?.role || "";
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  const toggleDropdown = (dropdownKey: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownKey]: !prev[dropdownKey]
    }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">로그인 후 이용해주세요.</p>
      </div>
    );
  }

  const renderMenuItems = () => {
    switch (role) {
      case "admin":
        return (
          <>
            {renderLink(
              "/",
              "홈",
              "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            )}
            {renderLink(
              "/mypage",
              "마이 페이지",
              "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            )}
            {renderLink(
              "/users",
              "사용자 관리",
              "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            )}
            {renderLink(
              "/order/work",
              "작업 현황",
              "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            )}
            {renderLink(
              "/content",
              "콘텐츠 관리",
              "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            )}
            <li>
              <button
                onClick={() => toggleDropdown("admin-order")}
                className="w-full flex items-center justify-between p-4 text-white hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon path="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  <span>주문관리</span>
                </div>
                <Icon 
                  path={openDropdowns["admin-order"] 
                    ? "M19 9l-7 7-7-7" 
                    : "M9 5l7 7-7 7"
                  } 
                />
              </button>
              {openDropdowns["admin-order"] && (
                <ul className="bg-gray-800">
                  {renderDropdownLink("/order", "게시판")}
                  {renderDropdownLink("/order/history", "주문내역")}
                </ul>
              )}
            </li>
          </>
        );
      case "seller":
        return (
          <>
            {renderLink(
              "/",
              "홈",
              "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            )}
            <li>
              <button
                onClick={() => toggleDropdown("seller-order")}
                className="w-full flex items-center justify-between p-4 text-white hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon path="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  <span>주문 관리</span>
                </div>
                <Icon 
                  path={openDropdowns["seller-order"] 
                    ? "M19 9l-7 7-7-7" 
                    : "M9 5l7 7-7 7"
                  } 
                />
              </button>
              {openDropdowns["seller-order"] && (
                <ul className="bg-gray-800">
                  {renderDropdownLink("/order", "주문 게시판")}
                  {renderDropdownLink("/order/work", "승인된 작업")}
                </ul>
              )}
            </li>
            {renderLink(
              "/point/withdraw",
              "포인트 환전",
              "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            )}
            {renderLink(
              "/mypage",
              "마이 페이지",
              "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            )}
          </>
        );
      case "buyer":
        return (
          <>
            {renderLink(
              "/",
              "홈",
              "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            )}
            <li>
              <button
                onClick={() => toggleDropdown("buyer-order")}
                className="w-full flex items-center justify-between p-4 text-white hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon path="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  <span>주문 관리</span>
                </div>
                <Icon 
                  path={openDropdowns["buyer-order"] 
                    ? "M19 9l-7 7-7-7" 
                    : "M9 5l7 7-7 7"
                  } 
                />
              </button>
              {openDropdowns["buyer-order"] && (
                <ul className="bg-gray-800">
                  {renderDropdownLink("/order", "주문 게시판")}
                  {renderDropdownLink("/order/request", "주문 신청")}
                  {renderDropdownLink("/order/history", "주문 내역")}
                </ul>
              )}
            </li>
            {renderLink(
              "/point/charge",
              "포인트 충전",
              "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            )}
            {renderLink(
              "/membership",
              "멤버십",
              "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            )}
            {renderLink(
              "/mypage",
              "마이 페이지",
              "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 모바일 최적화다만 나중에 해야지... */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed lg:static
          top-0 left-0
          h-full
          w-64
          bg-[#302c47]
          border-r border-gray-700
          rounded-r-4xl
          z-30
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-center p-6 flex-shrink-0">
          <img src="/logo.png" alt="logo이미지" className="w-10 h-10" />
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {renderMenuItems()}
            <li>
              <button
                aria-label="로그아웃"
                onClick={logout}
                className="w-full flex items-center space-x-3 p-4 text-red-400 hover:bg-gray-900 transition-colors"
              >
                <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                <span>로그아웃</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="flex-shrink-0">
          <Footer />
        </div>
      </aside>
    </>
  );
}
