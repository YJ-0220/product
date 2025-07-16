import { useOrderDetail } from "@/hooks/useOrderDetail";
import { useOrderApplication } from "@/hooks/useOrderApplication";
import { useUtils } from "@/hooks/useUtils";
import { Link } from "react-router-dom";

export default function OrderDetail() {
  // 데이터 관리 훅
  const { order, applications, loading, error, user, refreshData, navigate } =
    useOrderDetail();

  // 신청 관련 액션 훅
  const {
    handleDeleteApplication,
    handleSimpleApplication,
    handleOrderStatusUpdate,
    handleApplicationStatusUpdate,
    handleDeleteAcceptedApplication,
    updating,
  } = useOrderApplication();

  const { getStatusColor, getStatusText, formatDate } = useUtils();

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
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              order.status
            )}`}
          >
            {getStatusText(order.status)}
          </span>
          {order.status === "progress" && (
            <Link
              to={`/order/${order.id}/progress`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              작업 진행 상황
            </Link>
          )}
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              주문 정보
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  제목
                </label>
                <p className="text-gray-900">{order.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  설명
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {order.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    수량
                  </label>
                  <p className="text-gray-900">
                    {order.desiredQuantity.toLocaleString()}개
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  판매자 신청
                </h2>
                {order.status === "pending" ? (
                  <p className="text-sm text-blue-600">신청을 받고 있습니다</p>
                ) : order.status === "progress" ? (
                  <p className="text-sm text-green-600">
                    승인된 신청서가 작업물로 진행중입니다
                  </p>
                ) : order.status === "completed" ? (
                  <p className="text-sm text-gray-600">작업이 완료되었습니다</p>
                ) : (
                  <p className="text-sm text-red-600">주문이 취소되었습니다</p>
                )}
              </div>
              {user?.role === "seller" &&
                order.status === "pending" &&
                (() => {
                  // 현재 사용자가 이미 신청했는지 확인
                  const hasApplied = applications.some(
                    (app) => app.sellerId === user?.id
                  );

                  if (hasApplied) {
                    return (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600 font-medium">
                          신청 완료
                        </span>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleSimpleApplication(
                              order.id,
                              order.requiredPoints,
                              applications,
                              user?.id || "",
                              refreshData
                            )
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          신청하기
                        </button>
                      </div>
                    );
                  }
                })()}
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">
                  아직 신청한 판매자가 없습니다.
                </p>
                {order.status === "pending" && user?.role === "seller" && (
                  <p className="text-sm text-blue-600">
                    첫 번째로 신청해보세요!
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {applications.filter((app) => app.status === "pending").length >
                  0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      신청 단계
                    </h3>
                    <div className="space-y-3">
                      {applications
                        .filter(
                          (app) =>
                            app.status === "pending" ||
                            app.status === "rejected"
                        )
                        .map((application) => (
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
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    application.status
                                  )}`}
                                >
                                  {getStatusText(application.status)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                  {formatDate(application.createdAt)}
                                </span>
                                {user?.role === "seller" &&
                                  user?.id === application.sellerId &&
                                  application.status === "pending" && (
                                    <button
                                      onClick={() =>
                                        handleDeleteApplication(
                                          application.id,
                                          order.id,
                                          refreshData
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
                            {user?.role === "admin" &&
                              application.status === "pending" && (
                                <div className="flex justify-end space-x-2 mt-3 pt-3 border-t border-gray-200">
                                  <button
                                    onClick={() =>
                                      handleApplicationStatusUpdate(
                                        order.id,
                                        application.id,
                                        "rejected",
                                        refreshData
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
                                        order.id,
                                        application.id,
                                        "accepted",
                                        refreshData
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
                  </div>
                )}

                {/* 작업 단계 (승인된 신청) */}
                {applications.filter((app) => app.status === "accepted")
                  .length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 my-4">
                      작업 단계
                    </h3>
                    <div className="space-y-3">
                      {applications
                        .filter((app) => app.status === "accepted")
                        .map((application) => (
                          <div
                            key={application.id}
                            className="border border-green-200 bg-green-50 rounded-md p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-gray-900">
                                  {application.seller.name}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  작업 진행중
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                  승인일: {formatDate(application.updatedAt)}
                                </span>
                                {/* 관리자만 삭제 버튼 노출 */}
                                {user?.role === "admin" && (
                                  <button
                                    onClick={() => {
                                      if (
                                        window.confirm("정말 삭제하시겠습니까?")
                                      ) {
                                        handleDeleteAcceptedApplication(
                                          order.id,
                                          application.id,
                                          refreshData
                                        );
                                      }
                                    }}
                                    className="ml-2 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                    disabled={updating}
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

                            {/* 작업물 제출 상태 표시 */}
                            <div className="mt-3 pt-3 border-t border-green-200">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  작업물 상태
                                </span>
                                <span className="text-sm text-blue-600 font-medium">
                                  작업물 제출 대기중
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900">구매자 정보</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  구매자
                </label>
                <p className="text-gray-900">{order.buyer.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  생성일
                </label>
                <p className="text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              카테고리 정보
            </h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  상위 카테고리
                </label>
                <p className="text-gray-900">{order.category.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  하위 카테고리
                </label>
                <p className="text-gray-900">{order.subcategory.name}</p>
              </div>
            </div>
          </div>

          {user?.role === "admin" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900">상태 관리</h2>
              <div className="space-y-3">
                {["pending", "progress", "completed", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() =>
                        handleOrderStatusUpdate(order.id, status, refreshData)
                      }
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
