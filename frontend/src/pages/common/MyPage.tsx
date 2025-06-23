import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getPointChargeRequests, getPointHistory } from "@/api/points";

interface PointChargeRequest {
  id: string;
  userId: string;
  amount: number;
  status: string;
  requestedAt: string;
  approvedAt?: string;
}

interface PointTransaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  description?: string;
  createdAt: string;
}

export default function MyPage() {
  const { user } = useAuth();
  const [chargeRequests, setChargeRequests] = useState<PointChargeRequest[]>([]);
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'points' | 'charge-history'>('profile');

  useEffect(() => {
    if (activeTab === 'points' || activeTab === 'charge-history') {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'charge-history') {
        const response = await getPointChargeRequests();
        setChargeRequests(response.chargeRequests);
      } else if (activeTab === 'points') {
        const response = await getPointHistory();
        setPointHistory(response.pointHistory);
      }
    } catch (error) {
      console.error("데이터 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'approved':
        return '승인됨';
      case 'rejected':
        return '거절됨';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'charge':
        return '충전';
      case 'earn':
        return '적립';
      case 'spend':
        return '사용';
      case 'withdraw':
        return '출금';
      case 'admin_adjust':
        return '관리자 조정';
      default:
        return type;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'charge':
      case 'earn':
        return 'text-green-600';
      case 'spend':
      case 'withdraw':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">마이 페이지</h1>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.role === 'buyer' ? '구매자' : user?.role === 'seller' ? '판매자' : '관리자'}</p>
              <p className="text-sm text-gray-500">멤버십: {user?.membershipLevel || '없음'}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-gray-600">보유 포인트</p>
              <p className="text-2xl font-bold text-blue-600">
                {user?.points?.toLocaleString() || 0}P
              </p>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                프로필
              </button>
              <button
                onClick={() => setActiveTab('points')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'points'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                포인트 내역
              </button>
              <button
                onClick={() => setActiveTab('charge-history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'charge-history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                충전 신청 내역
              </button>
            </nav>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">사용자명</label>
                      <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">역할</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {user?.role === 'buyer' ? '구매자' : user?.role === 'seller' ? '판매자' : '관리자'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">멤버십 레벨</label>
                      <p className="mt-1 text-sm text-gray-900">{user?.membershipLevel || '없음'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">보유 포인트</label>
                      <p className="mt-1 text-sm text-gray-900 font-semibold">
                        {user?.points?.toLocaleString() || 0}P
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Link
                    to="/point/charge"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    포인트 충전 신청
                  </Link>
                  <Link
                    to="/order/request"
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    주문 요청하기
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'points' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">포인트 거래 내역</h3>
                  <button
                    onClick={fetchData}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    새로고침
                  </button>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">로딩 중...</p>
                  </div>
                ) : pointHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">포인트 거래 내역이 없습니다.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            날짜
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            유형
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            포인트
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pointHistory.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(transaction.createdAt).toLocaleDateString('ko-KR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-medium ${getTransactionTypeColor(transaction.type)}`}>
                                {getTransactionTypeText(transaction.type)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}P
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.description || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'charge-history' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">포인트 충전 신청 내역</h3>
                  <button
                    onClick={fetchData}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 