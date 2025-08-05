import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import KPICharts from "@/components/admin/KPICharts";
import { getAdminNotificationStats } from "@/api/admin";

interface NotificationStats {
  pendingChargeRequests: number;
  pendingWithdrawRequests: number;
  pendingApplications: number;
  totalPending: number;
}

export default function AdminHome() {
  const [notificationStats, setNotificationStats] = useState<NotificationStats>(
    {
      pendingChargeRequests: 0,
      pendingWithdrawRequests: 0,
      pendingApplications: 0,
      totalPending: 0,
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotificationStats();
  }, []);

  const fetchNotificationStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await getAdminNotificationStats();
      setNotificationStats(stats);
    } catch (error: any) {
      console.error("알림 통계 조회 실패:", error);
      setError(
        error.response?.data?.message || "알림 통계를 불러오는데 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <KPICharts />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              승인 대기 알림
              {notificationStats.totalPending > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  {notificationStats.totalPending}
                </span>
              )}
            </h3>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-red-800">
                  <svg
                    className="w-5 h-5 mr-2 inline"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
              <button
                onClick={fetchNotificationStats}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                다시 시도
              </button>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Link
                to="/users/point-requests"
                className="block p-4 border rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 text-lg">💰</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600">
                        포인트 충전 요청
                      </div>
                      <div className="text-sm text-gray-500">
                        승인이 필요한 충전 신청
                      </div>
                    </div>
                  </div>
                  {notificationStats.pendingChargeRequests > 0 ? (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                      {notificationStats.pendingChargeRequests}건
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                      0건
                    </span>
                  )}
                </div>
              </Link>

              <Link
                to="/users/point-requests"
                className="block p-4 border rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-orange-600 text-lg">💳</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-orange-600">
                        포인트 환전 요청
                      </div>
                      <div className="text-sm text-gray-500">
                        승인이 필요한 환전 신청
                      </div>
                    </div>
                  </div>
                  {notificationStats.pendingWithdrawRequests > 0 ? (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                      {notificationStats.pendingWithdrawRequests}건
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                      0건
                    </span>
                  )}
                </div>
              </Link>

              <Link
                to="/order"
                className="block p-4 border rounded-lg hover:bg-green-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-green-600 text-lg">📋</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-green-600">
                        주문 신청서
                      </div>
                      <div className="text-sm text-gray-500">
                        승인이 필요한 주문 신청
                      </div>
                    </div>
                  </div>
                  {notificationStats.pendingApplications > 0 ? (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                      {notificationStats.pendingApplications}건
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                      0건
                    </span>
                  )}
                </div>
              </Link>

              {notificationStats.totalPending === 0 && (
                <div className="text-center py-4 text-gray-500 border-t">
                  <div className="text-2xl mb-1">✅</div>
                  <p className="text-sm">모든 요청이 처리되었습니다</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            빠른 작업
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/users/point-requests"
              className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <div className="text-center">
                <span className="text-sm font-medium text-blue-700">
                  포인트 관리
                </span>
              </div>
            </Link>

            <Link
              to="/users"
              className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <div className="text-center">
                <span className="text-sm font-medium text-green-700">
                  사용자 관리
                </span>
              </div>
            </Link>

            <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <div className="text-center">
                <span className="text-sm font-medium text-purple-700">
                  메뉴3
                </span>
              </div>
            </button>

            <button className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
              <div className="text-center">
                <span className="text-sm font-medium text-orange-700">
                  메뉴4
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
