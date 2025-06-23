import { useDashboardStats } from "@/hooks/useAdminDashboardStats";
import { useState, useEffect } from "react";
import { getAllPointChargeRequests, updatePointChargeRequest } from "@/api/admin";

interface PointChargeRequest {
  id: string;
  userId: string;
  amount: number;
  status: string;
  requestedAt: string;
  approvedAt?: string;
  user: {
    name: string;
  };
}

export default function AdminHome() {
  const { stats } = useDashboardStats();
  const [chargeRequests, setChargeRequests] = useState<PointChargeRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChargeRequests();
  }, []);

  const fetchChargeRequests = async () => {
    try {
      setLoading(true);
      const response = await getAllPointChargeRequests();
      setChargeRequests(response.chargeRequests);
    } catch (error) {
      console.error("포인트 충전 신청 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      await updatePointChargeRequest(requestId, status);
      alert(`포인트 충전 신청이 ${status === 'approved' ? '승인' : '거절'}되었습니다.`);
      fetchChargeRequests(); // 목록 새로고침
    } catch (error) {
      console.error("포인트 충전 신청 처리 실패:", error);
      alert("처리에 실패했습니다.");
    }
  };

  const pendingRequests = chargeRequests.filter(req => req.status === 'pending');

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <div className="grid grid-cols-2 max-md:hidden lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 회원수</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers}</p>
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">↗ +12% 이번 달</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">대기중인 충전 신청</p>
                <p className="text-3xl font-bold text-gray-900">{pendingRequests.length}</p>
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-yellow-600 mt-2">처리 대기중</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 상품수</p>
                <p className="text-3xl font-bold text-gray-900">856</p>
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">↗ +8% 이번 주</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">오늘 주문</p>
                <p className="text-3xl font-bold text-gray-900">89</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">↗ +15% 어제 대비</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            {loading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">로딩 중...</p>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">대기중인 충전 신청이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.slice(0, 5).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{request.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {request.amount.toLocaleString()}P 신청
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(request.requestedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateRequest(request.id, 'approved')}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleUpdateRequest(request.id, 'rejected')}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        거절
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                최근 가입자
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                전체보기
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: "김철수",
                  email: "kim@example.com",
                  role: "구매자",
                  time: "2시간 전",
                },
                {
                  name: "이영희",
                  email: "lee@example.com",
                  role: "판매자",
                  time: "5시간 전",
                },
                {
                  name: "박민수",
                  email: "park@example.com",
                  role: "구매자",
                  time: "1일 전",
                },
              ].map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {user.role}
                    </p>
                    <p className="text-xs text-gray-500">{user.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">최근 주문</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                전체보기
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  id: "#1234",
                  customer: "홍길동",
                  amount: "125,000원",
                  status: "배송중",
                  time: "1시간 전",
                },
                {
                  id: "#1235",
                  customer: "김영수",
                  amount: "89,000원",
                  status: "결제완료",
                  time: "3시간 전",
                },
                {
                  id: "#1236",
                  customer: "박소연",
                  amount: "156,000원",
                  status: "배송완료",
                  time: "6시간 전",
                },
              ].map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.amount}</p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.status === "배송완료"
                            ? "bg-green-100 text-green-800"
                            : order.status === "배송중"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              빠른 작업
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
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
                      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-blue-700">
                    공지사항
                  </span>
                </div>
              </button>

              <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
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
                    쿠폰 발행
                  </span>
                </div>
              </button>

              <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-purple-700">
                    상품 승인
                  </span>
                </div>
              </button>

              <button className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-orange-700">
                    시스템 설정
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              신규 회원 등록
            </h3>


            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">참고:</span> 폐쇄몰이므로 모든
                회원가입은 관리자 승인이 필요합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
