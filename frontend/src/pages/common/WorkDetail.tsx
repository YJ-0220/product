import { Link } from "react-router-dom";
import { useWorkDetail } from "@/hooks/useWorkDetail";
import { useUtils } from "@/hooks/useUtils";

export default function WorkDetail() {
  const { workItem, loading, error, user, handleBack } = useWorkDetail();
  const { formatDateOnly } = useUtils();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <p className="text-gray-600">작업물을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  if (!workItem) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            작업물이 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            아직 작업물이 제출되지 않았습니다.
          </p>
          {user?.role === "seller" && (
            <Link
              to={`/order/work/submit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              작업물 제출하기
            </Link>
          )}
          <button
            onClick={handleBack}
            className="mt-4 ml-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-10 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">작업물 상세</h1>
        <div className="flex space-x-2">
          {user?.role === "seller" &&
            workItem?.application && (
              <Link
                to={`/order/work/${workItem.id}/edit`}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                작업물 수정
              </Link>
            )}
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            뒤로 가기
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              작업물 정보
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  작업물 설명
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {workItem.description || "작업물 설명이 없습니다."}
                </p>
              </div>

              {workItem.workLink && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    작업물 링크
                  </label>
                  {workItem.workLink.includes(",") ? (
                    <div className="space-y-2">
                      {workItem.workLink
                        .split(",")
                        .map((link: string, index: number) => {
                          const trimmedLink = link.trim();
                          return trimmedLink ? (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <span className="text-sm text-gray-500">•</span>
                              <a
                                href={trimmedLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline break-all"
                              >
                                {trimmedLink}
                              </a>
                            </div>
                          ) : null;
                        })}
                    </div>
                  ) : (
                    <a
                      href={workItem.workLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {workItem.workLink}
                    </a>
                  )}
                </div>
              )}

              {workItem.fileUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    첨부 파일
                  </label>
                  <a
                    href={workItem.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    파일 다운로드
                  </a>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  📅 제출일
                </label>
                <p className="text-blue-900 font-semibold">
                  {workItem.submittedAt
                    ? formatDateOnly(workItem.submittedAt)
                    : "아직 제출되지 않았습니다"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상태
                </label>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
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
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {workItem?.orderRequest && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                주문 정보
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    주문 제목
                  </label>
                  <p className="text-gray-900">
                    {workItem.orderRequest.title || "제목 없음"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    주문자
                  </label>
                  <p className="text-gray-900">
                    {workItem.orderRequest?.buyer?.username ||
                      "주문자 정보 없음"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    주문일
                  </label>
                  <p className="text-gray-900">
                    {workItem.orderRequest.createdAt
                      ? formatDateOnly(workItem.orderRequest.createdAt)
                      : "주문일 없음"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {workItem?.application && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                판매자 정보
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    판매자
                  </label>
                  <p className="text-gray-900">
                    {workItem.application.seller?.username ||
                      "판매자 정보 없음"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    신청일
                  </label>
                  <p className="text-gray-900">
                    {workItem.application.createdAt
                      ? formatDateOnly(workItem.application.createdAt)
                      : "신청일 없음"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
