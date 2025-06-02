import { useState, useEffect } from "react";

interface Stats {
  totalUsers: number;
  totalBuyers: number;
  totalSellers: number;
  totalAdmins: number;
}

export default function Admin() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBuyers: 0,
    totalSellers: 0,
    totalAdmins: 0,
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // TODO: 실제 API 연동 시 사용자 통계 가져오기
    setStats({
      totalUsers: 156,
      totalBuyers: 98,
      totalSellers: 45,
      totalAdmins: 3,
    });
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: 실제 다크모드 적용 로직
  };

  const refreshData = () => {
    // TODO: 데이터 새로고침 로직
    console.log("데이터 새로고침");
  };

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-blue-900">대시보드</h1>
          
          {/* 헤더 액션 버튼들 */}
          <div className="flex items-center space-x-4">
            {/* 검색바 */}
            <div className="relative">
              <input
                type="text"
                placeholder="사용자 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* 새로고침 버튼 */}
            <button
              onClick={refreshData}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="데이터 새로고침"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* 알림 버튼 */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
                title="알림"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5zM12 8v4l-4-4h8l-4 4z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* 알림 드롭다운 */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">알림</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-3 hover:bg-gray-50 border-b">
                      <p className="text-sm text-gray-900">새로운 사용자가 등록되었습니다</p>
                      <p className="text-xs text-gray-500">5분 전</p>
                    </div>
                    <div className="p-3 hover:bg-gray-50 border-b">
                      <p className="text-sm text-gray-900">시스템 업데이트 완료</p>
                      <p className="text-xs text-gray-500">1시간 전</p>
                    </div>
                    <div className="p-3 hover:bg-gray-50">
                      <p className="text-sm text-gray-900">데이터베이스 백업 완료</p>
                      <p className="text-xs text-gray-500">3시간 전</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 다크모드 토글 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="다크모드 토글"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* 프로필 드롭다운 */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">A</span>
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 프로필 드롭다운 메뉴 */}
              {showProfile && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-3 border-b">
                    <p className="font-semibold text-gray-900">관리자</p>
                    <p className="text-sm text-gray-500">admin@example.com</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                      프로필 설정
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                      계정 설정
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                      도움말
                    </button>
                    <hr className="my-1" />
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600">
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                총 사용자
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                구매자
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalBuyers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                판매자
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalSellers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                관리자
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalAdmins}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            빠른 액션
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/70 rounded-lg transition-colors">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="text-blue-700 dark:text-blue-300">
                  새 사용자 추가
                </span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-green-50 dark:bg-green-900/50 hover:bg-green-100 dark:hover:bg-green-900/70 rounded-lg transition-colors">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-green-700 dark:text-green-300">
                  시스템 보고서 생성
                </span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-purple-50 dark:bg-purple-900/50 hover:bg-purple-100 dark:hover:bg-purple-900/70 rounded-lg transition-colors">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-purple-700 dark:text-purple-300">
                  시스템 설정
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            최근 활동
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  새로운 구매자 계정이 생성되었습니다.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2분 전
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  판매자가 새 상품을 등록했습니다.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  15분 전
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  시스템 백업이 완료되었습니다.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  1시간 전
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  사용자 계정이 비활성화되었습니다.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  3시간 전
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
