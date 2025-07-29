import { useState, useEffect } from "react";
import { useAuthStore } from "@/hooks/store/useAuthStore";
import { Link } from "react-router-dom";
import type { ApplicationData } from "@/types/orderTypes";
import { useUtils } from "@/hooks/useUtils";

interface SellerStats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  completedOrders: number;
  totalEarnings: number;
}

export default function SellerHome() {
  const { user } = useAuthStore();
  const { getStatusText, getStatusColor, formatDate } = useUtils();
  const [stats, setStats] = useState<SellerStats>({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    completedOrders: 0,
    totalEarnings: 0,
  });
  const [recentApplications, setRecentApplications] = useState<
    ApplicationData[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      // 실제 API가 구현되면 사용
      // const [statsData, applicationsData] = await Promise.all([
      //   getSellerStats(),
      //   getApplicationsBySeller(),
      // ]);

      // 임시 데이터
      const mockStats: SellerStats = {
        totalApplications: 12,
        pendingApplications: 3,
        acceptedApplications: 7,
        completedOrders: 5,
        totalEarnings: 125000,
      };

      setStats(mockStats);
      setRecentApplications([]);
    } catch (error) {
      console.error("판매자 데이터 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            판매자 대시보드
          </h1>
          <p className="text-gray-600">
            안녕하세요, {user?.username}님! 오늘도 좋은 거래 되세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 신청</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalApplications}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">대기중</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pendingApplications}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">수락됨</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.acceptedApplications}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">완료</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.completedOrders}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">최근 신청</h3>
              <Link
                to="/order"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                전체보기
              </Link>
            </div>
            <div className="space-y-4">
              {recentApplications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  아직 신청한 주문이 없습니다.
                </p>
              ) : (
                recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 truncate">
                        {application.orderRequestId}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {getStatusText(application.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      판매자: {application.seller.username}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      신청일: {formatDate(application.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 빠른 작업 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              빠른 작업
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/order"
                className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              >
                <div className="text-center">
                  <svg
                    className="w-6 h-6 text-blue-600 mx-auto mb-2"
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
                  <span className="text-sm font-medium text-blue-700">
                    주문 찾기
                  </span>
                </div>
              </Link>

              <Link
                to="/point/withdraw"
                className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
              >
                <div className="text-center">
                  <svg
                    className="w-6 h-6 text-green-600 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  <span className="text-sm font-medium text-green-700">
                    포인트 환전
                  </span>
                </div>
              </Link>

              <Link
                to="/mypage"
                className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
              >
                <div className="text-center">
                  <svg
                    className="w-6 h-6 text-purple-600 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-purple-700">
                    내 정보
                  </span>
                </div>
              </Link>

              <button
                onClick={fetchSellerData}
                className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
              >
                <div className="text-center">
                  <svg
                    className="w-6 h-6 text-orange-600 mx-auto mb-2"
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
                  <span className="text-sm font-medium text-orange-700">
                    새로고침
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
