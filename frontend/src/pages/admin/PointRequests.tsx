import { useRef, useState, useEffect } from "react";
import PointChargeRequest from "@/components/admin/PointChargeRequest";
import PointWithdrawRequest from "@/components/admin/PointWithdrawRequest";
import { usePointManagement } from "@/hooks/usePointManagement";

export default function PointRequests() {
  const chargeRequestRef = useRef<{ refresh: () => void }>(null);
  const withdrawRequestRef = useRef<{ refresh: () => void }>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    pointChargeRequests,
    pointWithdrawRequests,
    fetchPointChargeRequests,
    fetchPointWithdrawRequests,
  } = usePointManagement();

  useEffect(() => {
    fetchPointChargeRequests();
    fetchPointWithdrawRequests();
  }, [fetchPointChargeRequests, fetchPointWithdrawRequests]);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    chargeRequestRef.current?.refresh();
    withdrawRequestRef.current?.refresh();

    // 새로고침 애니메이션을 위한 딜레이
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // 통계 계산
  const chargePending = pointChargeRequests.filter(
    (req) => req.status === "pending"
  ).length;
  const chargeApproved = pointChargeRequests.filter(
    (req) => req.status === "approved"
  ).length;
  const chargeRejected = pointChargeRequests.filter(
    (req) => req.status === "rejected"
  ).length;

  const withdrawPending = pointWithdrawRequests.filter(
    (req) => req.status === "pending"
  ).length;
  const withdrawApproved = pointWithdrawRequests.filter(
    (req) => req.status === "approved"
  ).length;
  const withdrawRejected = pointWithdrawRequests.filter(
    (req) => req.status === "rejected"
  ).length;

  const totalPending = chargePending + withdrawPending;
  const totalProcessed =
    chargeApproved + chargeRejected + withdrawApproved + withdrawRejected;

  // 총 금액 계산
  const totalChargeAmount = pointChargeRequests
    .filter((req) => req.status === "pending")
    .reduce((sum, req) => sum + req.amount, 0);

  const totalWithdrawAmount = pointWithdrawRequests
    .filter((req) => req.status === "pending")
    .reduce((sum, req) => sum + req.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold">포인트 승인 관리</h1>
              <p className="text-gray-600 mt-3 text-lg">
                사용자들의 포인트 충전 및 환전 신청을 효율적으로 관리하세요
              </p>
            </div>
            <button
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className={`group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                isRefreshing ? "animate-pulse" : ""
              }`}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-500 ${
                  isRefreshing ? "animate-spin" : "group-hover:rotate-180"
                }`}
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
              <span className="font-semibold">
                {isRefreshing ? "새로고침 중..." : "새로고침"}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-semibold uppercase tracking-wide">
                    대기 중
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {totalPending}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">처리 대기</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
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

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">
                    처리 완료
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {totalProcessed}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">승인/거절</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
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

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
                    충전 대기
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {(totalChargeAmount / 10000).toFixed(0)}만원
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {chargePending}건 대기
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
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
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-semibold uppercase tracking-wide">
                    환전 대기
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {(totalWithdrawAmount / 10000).toFixed(0)}만원
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {withdrawPending}건 대기
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-400 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <PointChargeRequest ref={chargeRequestRef} />
          </div>
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <PointWithdrawRequest ref={withdrawRequestRef} />
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                💡 관리 가이드
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    충전 신청 처리
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 결제 증빙을 확인한 후 승인하세요</li>
                    <li>• 승인 시 즉시 포인트가 지급됩니다</li>
                    <li>• 의심스러운 신청은 거절하세요</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    환전 신청 처리
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 계좌 정보를 정확히 확인하세요</li>
                    <li>• 승인 후 실제 송금을 진행하세요</li>
                    <li>• 처리 완료 후 사용자에게 알림하세요</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
