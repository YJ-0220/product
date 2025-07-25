import { useState, useEffect } from "react";
import { getAllUsers, deleteUser, chargeUserPoint } from "@/api/admin";
import { Link } from "react-router-dom";

interface User {
  id: string;
  username: string;
  role: string;
  membershipLevel?: string;
}

interface PointChargeModal {
  isOpen: boolean;
  user: User | null;
  amount: string;
  description: string;
  loading: boolean;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [deleting, setDeleting] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [pointModal, setPointModal] = useState<PointChargeModal>({
    isOpen: false,
    user: null,
    amount: "",
    description: "",
    loading: false,
  });

  // 사용자 목록 조회
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllUsers();
      setUsers(response.users || []);
    } catch (error: any) {
      setError("사용자 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 사용자 삭제
  const handleDeleteUser = async (userId: string, username: string) => {
    if (!window.confirm(`정말로 사용자 "${username}"를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setDeleting(userId);
      await deleteUser(userId);
      await fetchUsers(); // 목록 새로고침
      setSuccess(`사용자 "${username}"가 삭제되었습니다.`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error?.response?.data?.message || "사용자 삭제에 실패했습니다.");
    } finally {
      setDeleting("");
    }
  };

  // 포인트 충전 모달 열기
  const openPointModal = (user: User) => {
    setPointModal({
      isOpen: true,
      user,
      amount: "",
      description: "오류 보상 포인트",
      loading: false,
    });
  };

  // 포인트 충전 모달 닫기
  const closePointModal = () => {
    setPointModal({
      isOpen: false,
      user: null,
      amount: "",
      description: "",
      loading: false,
    });
  };

  // 포인트 충전 실행
  const handleChargePoint = async () => {
    if (!pointModal.user || !pointModal.amount) {
      return;
    }

    const amount = parseInt(pointModal.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("유효한 포인트 금액을 입력해주세요.");
      return;
    }

    try {
      setPointModal(prev => ({ ...prev, loading: true }));
      setError("");

      await chargeUserPoint(
        pointModal.user.id,
        amount,
        pointModal.description || "관리자 직접 충전"
      );

      setSuccess(`${pointModal.user.username}에게 ${amount.toLocaleString()}P를 충전했습니다.`);
      setTimeout(() => setSuccess(""), 3000);
      closePointModal();
    } catch (error: any) {
      setError(error?.response?.data?.message || "포인트 충전에 실패했습니다.");
    } finally {
      setPointModal(prev => ({ ...prev, loading: false }));
    }
  };

  const getMembershipBadge = (level?: string) => {
    if (!level) return <span className="text-gray-400">-</span>;

    const badges = {
      bronze: "bg-orange-100 text-orange-800",
      silver: "bg-gray-100 text-gray-800", 
      gold: "bg-yellow-100 text-yellow-800",
      platinum: "bg-purple-100 text-purple-800",
      vip: "bg-red-100 text-red-800"
    };

    const labels = {
      bronze: "브론즈",
      silver: "실버", 
      gold: "골드",
      platinum: "플래티넘",
      vip: "VIP"
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[level as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
        {labels[level as keyof typeof labels] || level}
      </span>
    );
  };

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
            <p className="text-gray-600 mt-2">전체 사용자 목록을 확인하고 관리할 수 있습니다.</p>
          </div>
          <Link
            to="/users/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            새 계정 생성
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-600 text-sm font-medium">{success}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-gray-600">사용자 목록을 불러오는 중...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600 text-lg mb-4">등록된 사용자가 없습니다.</p>
              <Link
                to="/users/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                첫 번째 사용자 생성하기
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      아이디
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      역할
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      멤버십 등급
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'buyer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'buyer' ? '구매자' : '판매자'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getMembershipBadge(user.membershipLevel)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openPointModal(user)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            포인트
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            disabled={deleting === user.id}
                            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:text-gray-400 transition-colors"
                          >
                            {deleting === user.id ? "삭제 중..." : "삭제"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            총 <span className="font-semibold text-gray-900">{users.length}</span>명의 사용자가 등록되어 있습니다.
          </p>
        </div>
      </div>

      {/* 포인트 충전 모달 */}
      {pointModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                포인트 충전 - {pointModal.user?.username}
              </h3>
              <button
                onClick={closePointModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  충전 금액 (포인트) *
                </label>
                <input
                  type="number"
                  value={pointModal.amount}
                  onChange={(e) => setPointModal(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 1000"
                  min="1"
                  disabled={pointModal.loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  충전 사유
                </label>
                <textarea
                  value={pointModal.description}
                  onChange={(e) => setPointModal(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 오류 보상, 이벤트 지급 등"
                  rows={3}
                  disabled={pointModal.loading}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={closePointModal}
                disabled={pointModal.loading}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleChargePoint}
                disabled={pointModal.loading || !pointModal.amount}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {pointModal.loading ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    충전 중...
                  </>
                ) : (
                  "포인트 충전"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
