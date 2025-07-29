import { useEffect, forwardRef, useImperativeHandle } from "react";
import { usePointManagement } from "@/hooks/usePointManagement";

interface PointChargeRequestRef {
  refresh: () => void;
}

const PointChargeRequestComponent = forwardRef<PointChargeRequestRef, {}>(
  (_props, ref) => {
    const {
      pointChargeRequests,
      fetchPointChargeRequests,
      handleChargeUpdate,
    } = usePointManagement();

    useEffect(() => {
      fetchPointChargeRequests();
    }, [fetchPointChargeRequests]);

    useImperativeHandle(ref, () => ({
      refresh: fetchPointChargeRequests,
    }));

    const pendingRequests = pointChargeRequests
      .filter((req) => req.status === "pending")
      .slice(0, 3);

    if (pointChargeRequests.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            포인트 충전 신청
          </h3>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
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
            <p className="text-gray-500">대기중인 충전 신청이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                {request && (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm font-medium">
                            {request.user?.username?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {request.user?.username || "알 수 없는 사용자"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(request.requestedAt).toLocaleDateString(
                              "ko-KR"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-lg font-bold text-green-600">
                          {request.amount.toLocaleString()}원 충전 신청
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleChargeUpdate(request.id, "approved")
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                      >
                        승인
                      </button>
                      <button
                        onClick={() =>
                          handleChargeUpdate(request.id, "rejected")
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                      >
                        거절
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {pointChargeRequests.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">
              {pendingRequests.length}건 대기중
            </p>
          </div>
        )}
      </div>
    );
  }
);

PointChargeRequestComponent.displayName = "PointChargeRequest";

export default PointChargeRequestComponent;
