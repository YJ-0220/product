import { useState, useEffect } from "react";
import type { PointChargeRequest } from "@/types/pointRequestTypes";
import { getPointChargeRequests } from "@/api/points";
import { useUtils } from "@/hooks/useUtils";

export default function PointChargeHistory() {
  const { getStatusText, getStatusColor } = useUtils();
  const [chargeRequests, setChargeRequests] = useState<PointChargeRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChargeRequests();
  }, []);

  const fetchChargeRequests = async () => {
    try {
      setLoading(true);
      const response = await getPointChargeRequests();
      setChargeRequests(response.chargeRequests);
    } catch (error) {
      console.error("포인트 충전 신청 내역 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">포인트 충전 신청 내역</h1>
          <button
            onClick={fetchChargeRequests}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            새로고침
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : chargeRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">포인트 충전 신청 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      신청일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      충전 포인트
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      처리일
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chargeRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(request.requestedAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.amount.toLocaleString()}P
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.approvedAt 
                          ? new Date(request.approvedAt).toLocaleDateString('ko-KR')
                          : '-'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 