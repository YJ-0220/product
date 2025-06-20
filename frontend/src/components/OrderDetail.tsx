import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrderStatus, type OrderData, createApplication, getApplicationsByOrder, updateApplicationStatus, type ApplicationData } from "@/api/order";
import { useAuth } from "@/context/AuthContext";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    message: "",
    proposedPrice: "",
    estimatedDelivery: "",
  });

  useEffect(() => {
    if (!id) {
      setError("주문 ID가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [orderData, applicationsData] = await Promise.all([
          getOrderById(id),
          getApplicationsByOrder(id),
        ]);
        setOrder(orderData);
        setApplications(applicationsData.applications);
      } catch (error: any) {
        setError(error?.response?.data?.error || "데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order || !id) return;

    try {
      setUpdating(true);
      const updatedOrder = await updateOrderStatus(id, newStatus);
      setOrder(updatedOrder);
    } catch (error: any) {
      setError(error?.response?.data?.error || "상태 변경에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setUpdating(true);
      const data = {
        message: applicationForm.message || undefined,
        proposedPrice: applicationForm.proposedPrice ? Number(applicationForm.proposedPrice) : undefined,
        estimatedDelivery: applicationForm.estimatedDelivery || undefined,
      };
      
      await createApplication(id, data);
      
      // 신청 목록 새로고침
      const applicationsData = await getApplicationsByOrder(id);
      setApplications(applicationsData.applications);
      
      // 폼 초기화 및 닫기
      setApplicationForm({ message: "", proposedPrice: "", estimatedDelivery: "" });
      setShowApplicationForm(false);
    } catch (error: any) {
      setError(error?.response?.data?.error || "신청 제출에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  const handleApplicationStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      setUpdating(true);
      await updateApplicationStatus(applicationId, newStatus);
      
      // 신청 목록 새로고침
      if (id) {
        const applicationsData = await getApplicationsByOrder(id);
        setApplications(applicationsData.applications);
      }
    } catch (error: any) {
      setError(error?.response?.data?.error || "신청 상태 변경에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기중";
      case "IN_PROGRESS":
        return "진행중";
      case "COMPLETED":
        return "완료";
      case "CANCELLED":
        return "취소";
      default:
        return status;
    }
  };

  const getApplicationStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "검토중";
      case "ACCEPTED":
        return "수락됨";
      case "REJECTED":
        return "거절됨";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-8 py-6">
        <p className="text-gray-600">주문을 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{order.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>주문 ID: {order.id}</span>
            <span>생성일: {formatDate(order.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
            {getStatusText(order.status)}
          </span>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            뒤로 가기
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 메인 컨텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 주문 정보 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">주문 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <p className="text-gray-900">{order.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <p className="text-gray-900 whitespace-pre-wrap">{order.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">수량</label>
                  <p className="text-gray-900">{order.desiredQuantity.toLocaleString()}개</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">필요 포인트</label>
                  <p className="text-gray-900">{order.requiredPoints.toLocaleString()}P</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">마감일</label>
                <p className="text-gray-900">{formatDate(order.deadline)}</p>
              </div>
            </div>
          </div>

          {/* 카테고리 정보 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">카테고리 정보</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상위 카테고리</label>
                <p className="text-gray-900">{order.category.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">하위 카테고리</label>
                <p className="text-gray-900">{order.subcategory.name}</p>
              </div>
            </div>
          </div>

          {/* 판매자 신청 목록 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">판매자 신청 ({applications.length})</h2>
              {user?.role === "seller" && order.status === "PENDING" && (
                <button
                  onClick={() => setShowApplicationForm(!showApplicationForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {showApplicationForm ? "취소" : "신청하기"}
                </button>
              )}
            </div>

            {/* 신청 폼 */}
            {showApplicationForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">메시지</label>
                    <textarea
                      value={applicationForm.message}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="구매자에게 전달할 메시지를 입력하세요..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">제안 가격 (선택)</label>
                      <input
                        type="number"
                        value={applicationForm.proposedPrice}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, proposedPrice: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="제안 가격"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">예상 배송일 (선택)</label>
                      <input
                        type="date"
                        value={applicationForm.estimatedDelivery}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                      {updating ? "제출 중..." : "신청 제출"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 신청 목록 */}
            {applications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">아직 신청한 판매자가 없습니다.</p>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{application.seller.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApplicationStatusBadgeClass(application.status)}`}>
                          {getApplicationStatusText(application.status)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(application.createdAt)}</span>
                    </div>
                    
                    {application.message && (
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">{application.message}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {application.proposedPrice && (
                        <div>
                          <span className="text-gray-600">제안 가격:</span>
                          <span className="ml-2 font-medium">{application.proposedPrice.toLocaleString()}P</span>
                        </div>
                      )}
                      {application.estimatedDelivery && (
                        <div>
                          <span className="text-gray-600">예상 배송일:</span>
                          <span className="ml-2 font-medium">{formatDate(application.estimatedDelivery)}</span>
                        </div>
                      )}
                    </div>

                    {/* 구매자/관리자용 상태 변경 버튼 */}
                    {(user?.role === "admin" || user?.id === order.buyerId) && application.status === "PENDING" && (
                      <div className="flex justify-end space-x-2 mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleApplicationStatusUpdate(application.id, "REJECTED")}
                          disabled={updating}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
                        >
                          거절
                        </button>
                        <button
                          onClick={() => handleApplicationStatusUpdate(application.id, "ACCEPTED")}
                          disabled={updating}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                        >
                          수락
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 구매자 정보 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">구매자 정보</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">구매자</label>
                <p className="text-gray-900">{order.buyer.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">구매자 ID</label>
                <p className="text-gray-900 text-sm">{order.buyerId}</p>
              </div>
            </div>
          </div>

          {/* 관리자용 상태 변경 */}
          {user?.role === "admin" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">상태 관리</h2>
              <div className="space-y-3">
                {["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating || order.status === status}
                    className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      order.status === status
                        ? "bg-blue-600 text-white cursor-default"
                        : updating
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {updating ? "처리 중..." : getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}