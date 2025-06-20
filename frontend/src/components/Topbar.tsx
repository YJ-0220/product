import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { user, logout } = useAuth();
  const role = user?.role || "";

  const getUserGreeting = () => {
    const userName = user?.name || "사용자";

    switch (role) {
      case "admin":
        return (
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-black">
              환영합니다, 관리자님
            </span>
          </div>
        );
      case "seller":
        return (
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-black">
              환영합니다, {userName}님
            </span>
          </div>
        );
      case "buyer":
        return (
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-black">
              환영합니다, {userName}님
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const getNotifications = () => {
    switch (role) {
      case "admin":
        return [
          { message: "새로운 사용자가 등록되었습니다", time: "5분 전" },
          { message: "시스템 업데이트 완료", time: "1시간 전" },
          { message: "데이터베이스 백업 완료", time: "3시간 전" },
        ];
      case "seller":
        return [
          { message: "새로운 주문이 접수되었습니다", time: "10분 전" },
          { message: "상품 재고가 부족합니다", time: "30분 전" },
          { message: "판매 통계 업데이트", time: "2시간 전" },
        ];
      case "buyer":
        return [
          { message: "주문 상품이 배송 중입니다", time: "1시간 전" },
          { message: "관심 상품 가격이 변동되었습니다", time: "3시간 전" },
          { message: "새로운 할인 쿠폰이 발급되었습니다", time: "1일 전" },
        ];
      default:
        return [];
    }
  };

  const getSettingsMenuItems = () => {
    const commonItems = [
      { label: "환경 설정", action: () => console.log("환경 설정") },
      { label: "알림 설정", action: () => console.log("알림 설정") },
      { label: "테마 설정", action: () => console.log("테마 설정") },
    ];

    const roleSpecificItems = (() => {
      switch (role) {
        case "admin":
          return [
            { label: "시스템 설정", action: () => console.log("시스템 설정") },
            { label: "보안 설정", action: () => console.log("보안 설정") },
            { label: "백업 설정", action: () => console.log("백업 설정") },
          ];
        case "seller":
          return [
            { label: "판매 설정", action: () => console.log("판매 설정") },
            { label: "배송 설정", action: () => console.log("배송 설정") },
            { label: "결제 설정", action: () => console.log("결제 설정") },
          ];
        case "buyer":
          return [
            { label: "주문 설정", action: () => console.log("주문 설정") },
            { label: "배송지 관리", action: () => console.log("배송지 관리") },
            {
              label: "결제 수단 관리",
              action: () => console.log("결제 수단 관리"),
            },
          ];
        default:
          return [];
      }
    })();

    return [...commonItems, ...roleSpecificItems];
  };

  const getProfileMenuItems = () => {
    const commonItems = [
      { label: "프로필 설정", action: () => console.log("프로필 설정") },
      { label: "계정 설정", action: () => console.log("계정 설정") },
    ];

    const roleSpecificItems = (() => {
      switch (role) {
        case "admin":
          return [
            { label: "시스템 관리", action: () => console.log("시스템 관리") },
            { label: "사용자 관리", action: () => console.log("사용자 관리") },
          ];
        case "seller":
          return [
            { label: "상품 관리", action: () => console.log("상품 관리") },
            { label: "주문 관리", action: () => console.log("주문 관리") },
            { label: "판매 통계", action: () => console.log("판매 통계") },
          ];
        case "buyer":
          return [
            { label: "주문 내역", action: () => console.log("주문 내역") },
            { label: "관심 상품", action: () => console.log("관심 상품") },
            { label: "쿠폰함", action: () => console.log("쿠폰함") },
          ];
        default:
          return [];
      }
    })();

    return [
      ...commonItems,
      ...roleSpecificItems,
      { label: "도움말", action: () => console.log("도움말") },
    ];
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const notifications = getNotifications();
  const settingsMenuItems = getSettingsMenuItems();
  const profileMenuItems = getProfileMenuItems();

  return (
    <div className="sticky bg-[#f2f7fb] top-0 z-10">
      <div className="flex items-center justify-between shadow-sm p-4">
        <div className="flex items-center">{getUserGreeting()}</div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
              title="알림"
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
                  d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5zM12 8v4l-4-4h8l-4 4z"
                />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border z-50">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-900">알림</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-gray-50 border-b last:border-b-0"
                      >
                        <p className="text-sm text-gray-900">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      새로운 알림이 없습니다
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="환경설정"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {showSettings && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border z-50">
                <div className="p-3 border-b">
                  <p className="font-semibold text-gray-900">환경설정</p>
                </div>
                <div className="py-1">
                  {settingsMenuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-900 text-sm"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="사용자 설정"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
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
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border z-50">
                <div className="p-3 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {user?.name}님
                  </h2>
                  <p className="text-sm text-gray-500">
                    등급: {user?.membershipLevel}
                  </p>
                  <p className="text-sm text-gray-500">
                    보유 포인트: {user?.points != null ? Math.floor(user.points).toLocaleString() : 0}P
                  </p>
                </div>
                <div className="py-1">
                  {profileMenuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-900"
                    >
                      {item.label}
                    </button>
                  ))}
                  <hr className="my-1" />
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
