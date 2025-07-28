import { useRef } from "react";
import PointChargeRequest from "@/components/admin/PointChargeRequest";
import PointWithdrawRequest from "@/components/admin/PointWithdrawRequest";

export default function PointRequests() {
  const chargeRequestRef = useRef<{ refresh: () => void }>(null);
  const withdrawRequestRef = useRef<{ refresh: () => void }>(null);

  const handleRefreshAll = () => {
    chargeRequestRef.current?.refresh();
    withdrawRequestRef.current?.refresh();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">포인트 승인 관리</h1>
          <p className="text-gray-600 mt-2">
            사용자들의 포인트 충전 및 환전 신청을 승인하거나 거부할 수 있습니다.
          </p>
        </div>
        <button
          onClick={handleRefreshAll}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>새로고침</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PointChargeRequest ref={chargeRequestRef} />
        <PointWithdrawRequest ref={withdrawRequestRef} />
      </div>
    </div>
  );
} 