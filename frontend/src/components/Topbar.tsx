import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { Link } from "react-router-dom";

export default function Topbar() {
  const { user, logout } = useAuthStore();
  const [showProfile, setShowProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky bg-[#f2f7fb] top-0 z-10">
      <div className="flex items-center justify-end shadow-sm p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 rounded-lg transition-colors cursor-pointer"
            title="새로고침"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 text-gray-600 rounded-lg transition-colors"
              title="사용자 설정"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showProfile && (
              <div
                ref={menuRef}
                className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border z-50"
              >
                <div className="p-3 border-b">
                  <h2 className="pb-1 text-lg font-semibold text-gray-900">
                    {user?.username}님 어서오세요
                  </h2>
                  <p className="text-sm text-gray-500">
                    보유 포인트:{" "}
                    {user?.points != null
                      ? Math.floor(user.points).toLocaleString()
                      : 0}
                    P
                  </p>
                  <p className="text-sm text-gray-500">
                    등급: {user?.membershipLevel}
                  </p>
                </div>
                <Link to="/my">
                  <div className="px-4 py-2 border-b hover:bg-gray-50 text-sm text-gray-900 flex flex-col">
                    마이페이지
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
