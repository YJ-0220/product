import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useUtils } from "@/hooks/useUtils";
import { useWorkList } from "@/hooks/useWorkList";

export default function WorkList() {
  const { user } = useAuth();
  const { formatDate } = useUtils();
  const navigate = useNavigate();

  const {
    acceptedOrder,
    filteredApplications,
    loading,
    error,
    updatingStatus,
    filter,
    setFilter,
    handleStatusUpdate,
  } = useWorkList();

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
      </div>
    );
  }

  return (
    <div className="px-10 py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">작업 게시판</h1>
        <p className="text-gray-600 mt-2">
          승인된 신청서와 작업물을 확인할 수 있습니다.
        </p>

        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            전체 작업 ({acceptedOrder.length})
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "in-progress"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            진행중인 작업 ({filteredApplications.length})
          </button>
        </div>
      </div>

      {user?.role === "seller" ? (
        acceptedOrder.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "in-progress"
                ? "진행중인 작업이 없습니다"
                : "아직 승인된 신청이 없습니다"}
            </h3>
            <p className="text-gray-500">
              {filter === "in-progress"
                ? "작업물을 제출하고 진행중인 작업이 있으면 여기에 표시됩니다."
                : "관리자가 신청을 승인하면 여기에 표시됩니다."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {application.orderRequest.title}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {application.orderRequest.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        application.workItems.length > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {application.workItems.length > 0
                        ? "작업물 제출됨"
                        : "작업물 미제출"}
                    </span>
                    <span className="text-sm text-gray-500">
                      승인일: {formatDate(application.updatedAt)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      주문 정보
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>주문자: {application.orderRequest.buyer.name}</p>
                      <p>
                        주문일: {formatDate(application.orderRequest.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      신청 정보
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>신청일: {formatDate(application.createdAt)}</p>
                      {application.orderRequest.requiredPoints && (
                        <p>
                          제안 가격:{" "}
                          {application.orderRequest.requiredPoints.toLocaleString()}
                          P
                        </p>
                      )}
                      {application.orderRequest.status === "progress" && (
                        <p>
                          예상 완료일:{" "}
                          {formatDate(application.orderRequest.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      작업물
                    </h4>
                    <div className="flex space-x-2">
                      {application.workItems.length === 0 ? (
                        <Link
                          to="/order/work/submit"
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                          작업물 제출
                        </Link>
                      ) : (
                        <Link
                          to="/order/work/submit"
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                        >
                          작업물 수정
                        </Link>
                      )}
                    </div>
                  </div>

                  {application.workItems.length > 0 ? (
                    <div className="space-y-2">
                      {application.workItems.map((workItem) => (
                        <div
                          key={workItem.id}
                          className="bg-gray-50 p-3 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => navigate(`/order/work/${workItem.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {workItem.description || "작업물"}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  workItem.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : workItem.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {workItem.status === "approved"
                                  ? "승인됨"
                                  : workItem.status === "rejected"
                                  ? "거절됨"
                                  : "검토중"}
                              </span>
                              {user?.role === "buyer" &&
                                workItem.status === "submitted" && (
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusUpdate(
                                          application.id,
                                          workItem.id,
                                          "approved"
                                        );
                                      }}
                                      disabled={
                                        updatingStatus ===
                                        `${application.orderRequest.id}-${application.id}`
                                      }
                                      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                    >
                                      승인
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusUpdate(
                                          application.id,
                                          workItem.id,
                                          "rejected"
                                        );
                                      }}
                                      disabled={
                                        updatingStatus ===
                                        `${application.orderRequest.id}-${application.id}`
                                      }
                                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                    >
                                      거절
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                          {workItem.submittedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              제출일: {formatDate(workItem.submittedAt)}
                            </p>
                          )}
                          {user?.role === "seller" && (
                            <div className="mt-2 flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/order/work/${workItem.id}`);
                                }}
                              >
                                작업물이 진행 중입니다.
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      아직 작업물이 제출되지 않았습니다.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            구매자 전용 페이지입니다
          </h3>
          <p className="text-gray-500">
            판매자로 로그인하여 작업현황을 확인하세요.
          </p>
        </div>
      )}
    </div>
  );
}
