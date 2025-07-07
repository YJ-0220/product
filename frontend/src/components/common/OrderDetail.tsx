import { useOrderRequestDetail } from "@/hooks/useOrderRequestDetail";
import { useOrderApplicationRequest } from "@/hooks/useOrderApplicationRequest";

export default function OrderDetail() {
  const {
    order,
    applications,
    loading,
    error,
    updating,
    user,
    handleOrderStatusUpdate,
    handleApplicationStatusUpdate,
    refreshData,
    navigate,
    getStatusBadgeClass,
    getStatusText,
    formatDate,
  } = useOrderRequestDetail();

  const {
    handleDeleteApplication,
    handleSimpleApplication,
    getApplicationStatusBadgeClass,
    getApplicationStatusText,
  } = useOrderApplicationRequest();

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
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{order.title}</h1>
        <div className="flex items-center space-x-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
              order.status
            )}`}
          >
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
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              주문 정보
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <p className="text-gray-900">{order.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {order.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    수량
                  </label>
                  <p className="text-gray-900">
                    {order.desiredQuantity.toLocaleString()}개
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  마감일
                </label>
                <p className="text-gray-900">
                  {order.deadline ? formatDate(order.deadline) : "마감일 없음"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                판매자 신청 ({applications.length})
              </h2>
              {user?.role === "seller" && order.status === "pending" && (
                <button
                  onClick={() => handleSimpleApplication(
                    order.id,
                    order.requiredPoints,
                    applications,
                    user?.id || '',
                    refreshData
                  )}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  신청하기
                </button>
              )}
            </div>

            {applications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                아직 신청한 판매자가 없습니다.
              </p>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-md p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">
                          {application.seller.name}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getApplicationStatusBadgeClass(
                            application.status
                          )}`}
                        >
                          {getApplicationStatusText(application.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {formatDate(application.createdAt)}
                        </span>
                        {user?.role === "seller" &&
                          user?.id === application.sellerId &&
                          application.status === "pending" &&
                          order?.status === "pending" && (
                            <button
                              onClick={() =>
                                handleDeleteApplication(
                                  application.id,
                                  order.id,
                                  () => {
                                    refreshData();
                                  }
                                )
                              }
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              삭제
                            </button>
                          )}
                      </div>
                    </div>

                    {application.message && (
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                        {application.message}
                      </p>
                    )}
                    {(user?.role === "admin" || user?.id === order.buyerId) &&
                      application.status === "pending" && (
                        <div className="flex justify-end space-x-2 mt-3 pt-3 border-t border-gray-200">
                          <button
                            onClick={() =>
                              handleApplicationStatusUpdate(
                                application.id,
                                "rejected"
                              )
                            }
                            disabled={updating}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
                          >
                            거절
                          </button>
                          <button
                            onClick={() =>
                              handleApplicationStatusUpdate(
                                application.id,
                                "accepted"
                              )
                            }
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

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              구매자 정보
            </h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  구매자
                </label>
                <p className="text-gray-900">{order.buyer.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  생성일
                </label>
                <p className="text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              카테고리 정보
            </h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상위 카테고리
                </label>
                <p className="text-gray-900">{order.category.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  하위 카테고리
                </label>
                <p className="text-gray-900">{order.subcategory.name}</p>
              </div>
            </div>
          </div>

          {user?.role === "admin" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                상태 관리
              </h2>
              <div className="space-y-3">
                {["pending", "progress", "completed", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => handleOrderStatusUpdate(status)}
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
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
