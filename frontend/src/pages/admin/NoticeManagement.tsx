import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminNotices, deleteNotice } from "@/api/contents";
import type { Notice } from "@/api/contents";
import { useLoading } from "@/hooks/useLoading";
import { useUtils } from "@/hooks/useUtils";

export default function NoticeManagement() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [deleting, setDeleting] = useState<string>("");

  const { formatDate } = useUtils();
  const { withLoading, loading } = useLoading();

  // 공지사항 목록 조회
  const fetchNotices = async () => {
    try {
      setError("");
      const response = await withLoading(getAdminNotices);
      setNotices(response.notices);
    } catch (error: any) {
      setError("공지사항 목록을 불러올 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // 공지사항 삭제
  const handleDeleteNotice = async (noticeId: string, title: string) => {
    if (!window.confirm(`정말로 공지사항 "${title}"를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setDeleting(noticeId);
      await deleteNotice(noticeId);
      await fetchNotices(); // 목록 새로고침
      setSuccess(`공지사항 "${title}"가 삭제되었습니다.`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error?.response?.data?.error || "공지사항 삭제에 실패했습니다.");
    } finally {
      setDeleting("");
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      urgent: "bg-red-100 text-red-800",
      important: "bg-orange-100 text-orange-800",
      normal: "bg-gray-100 text-gray-800",
    };

    const labels = {
      urgent: "긴급",
      important: "중요",
      normal: "일반",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          badges[priority as keyof typeof badges]
        }`}
      >
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">공지사항 관리</h1>
          <p className="text-gray-600 mt-2">
            공지사항을 생성, 수정, 삭제할 수 있습니다.
          </p>
        </div>
        <Link
          to="/content/notices/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          새 공지사항 작성
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
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
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-600 text-sm font-medium">{success}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <svg
                className="w-5 h-5 mr-2 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <p className="text-gray-600">공지사항을 불러오는 중...</p>
            </div>
          </div>
        )}
        {notices.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
            <p className="text-gray-600 text-lg mb-4">
              등록된 공지사항이 없습니다.
            </p>
            <Link
              to="/content/notices/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              첫 번째 공지사항 작성하기
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    중요도
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notices.map((notice) => (
                  <tr
                    key={notice.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {notice.isPinned && (
                          <svg
                            className="w-4 h-4 text-red-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {notice.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {notice.content.length > 50
                              ? `${notice.content.substring(0, 50)}...`
                              : notice.content}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(notice.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          notice.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {notice.isActive ? "활성" : "비활성"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {notice.author.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(notice.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Link
                          to={`/content/notices/${notice.id}/edit`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() =>
                            handleDeleteNotice(notice.id, notice.title)
                          }
                          disabled={deleting === notice.id}
                          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:text-gray-400 transition-colors"
                        >
                          {deleting === notice.id ? "삭제 중..." : "삭제"}
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
          총{" "}
          <span className="font-semibold text-gray-900">{notices.length}</span>
          개의 공지사항이 등록되어 있습니다.
        </p>
      </div>
    </div>
  );
}
