import { useState, useEffect } from "react";
import {
  getAllPointChargeRequests,
  updatePointChargeRequest,
} from "@/api/admin";
import type { PointChargeRequest } from "@/types/pointRequestTypes";

export default function PointChargeRequest() {
  const [chargeRequests, setChargeRequests] = useState<PointChargeRequest[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChargeRequests();
  }, []);

  const fetchChargeRequests = async () => {
    try {
      setLoading(true);
      const response = await getAllPointChargeRequests();
      setChargeRequests(response.chargeRequests || []);
    } catch (error) {
      console.error("포인트 충전 신청 목록 조회 실패:", error);
      setChargeRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (
    requestId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await updatePointChargeRequest(requestId, status);
      alert(
        `포인트 충전 신청이 ${
          status === "approved" ? "승인" : "거절"
        }되었습니다.`
      );
      fetchChargeRequests();
    } catch (error) {
      console.error("포인트 충전 신청 처리 실패:", error);
      alert("처리에 실패했습니다.");
    }
  };

  const pendingRequests = chargeRequests
    .filter((req) => req.status === "pending")
    .slice(0, 3);

  if (loading) {
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          포인트 충전 신청
        </h3>
        <button
          onClick={fetchChargeRequests}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          새로고침
        </button>
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
            <div key={request.id} className="border rounded-lg p-4 bg-gray-50">
              {request && (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm font-medium">
                          {request.user?.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {request.user?.name || "알 수 없는 사용자"}
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
                        handleUpdateRequest(request.id, "approved")
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                    >
                      승인
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateRequest(request.id, "rejected")
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

      {chargeRequests.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">
            {pendingRequests.length}건 대기중
          </p>
        </div>
      )}
    </div>
  );
}
