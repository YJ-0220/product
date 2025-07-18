import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FormInput from "@/components/FormInput";
import { createWorkProgress, getWorkProgress } from "@/api/order";
import type { WorkProgressData } from "@/types/orderTypes";
import { useUtils } from "@/hooks/useUtils";

interface WorkProgressFormData {
  title: string;
  description: string;
  progressPercent: string;
  status: "not_started" | "in_progress" | "completed";
}

export default function WorkProgressForm() {
  const { orderId, applicationId } = useParams<{
    orderId: string;
    applicationId: string;
  }>();
  const { getStatusText } = useUtils();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [workProgresses, setWorkProgresses] = useState<WorkProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<WorkProgressFormData>({
    title: "",
    description: "",
    progressPercent: "0",
    status: "in_progress",
  });

  // 작업 진행 상황 조회
  useEffect(() => {
    const fetchWorkProgress = async () => {
      if (!orderId || !applicationId) {
        setError("주문 ID 또는 신청서 ID가 없습니다.");
        return;
      }

      try {
        setLoading(true);

        const progressData = await getWorkProgress(orderId, applicationId);
        setWorkProgresses(progressData.workProgresses || []);
      } catch (error: any) {
        setError("작업 진행 상황을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkProgress();
  }, [orderId, applicationId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "progressPercent" ? value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId || !applicationId) {
      setError("주문 ID 또는 신청서 ID가 없습니다.");
      return;
    }

    if (!formData.title.trim()) {
      setError("진행 상황 제목을 입력해주세요.");
      return;
    }

    if (
      Number(formData.progressPercent) < 0 ||
      Number(formData.progressPercent) > 100
    ) {
      setError("진행률은 0-100 사이의 값이어야 합니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const workProgressData = {
        title: formData.title,
        description: formData.description,
        progressPercent: Number(formData.progressPercent),
        status: formData.status,
        imageUrls: [], // TODO: 이미지 업로드 기능 추가
      };

      await createWorkProgress({
        ...workProgressData,
        orderId,
        applicationId,
      });

      setSuccess("작업 진행 상황이 업데이트되었습니다.");
      setFormData({
        title: "",
        description: "",
        progressPercent: "0",
        status: "in_progress",
      });

      // 진행 상황 목록 새로고침
      const progressData = await getWorkProgress(orderId, applicationId);
      setWorkProgresses(progressData.workProgresses || []);
    } catch (error: any) {
      setError(
        error?.response?.data?.error ||
          "작업 진행 상황 업데이트에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        작업 진행 상황 업데이트
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="진행 상황 제목"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="예: 디자인 초안 완성"
        />

        <FormInput
          label="상세 설명"
          name="description"
          value={formData.description}
          onChange={handleChange}
          type="textarea"
          rows={3}
          placeholder="작업 진행 상황에 대한 상세한 설명을 입력해주세요."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="진행률 (%)"
            name="progressPercent"
            value={formData.progressPercent}
            onChange={handleChange}
            type="number"
            min="0"
            max="100"
          />

          <FormInput
            label="상태"
            name="status"
            value={formData.status}
            onChange={handleChange}
            type="select"
            options={[
              { value: "not_started", label: "시작 전" },
              { value: "in_progress", label: "진행 중" },
              { value: "completed", label: "완료" },
            ]}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? "업데이트 중..." : "진행 상황 업데이트"}
          </button>
        </div>
      </form>

      {workProgresses.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            진행 상황 히스토리
          </h3>
          <div className="space-y-4">
            {workProgresses.map((progress) => (
              <div
                key={progress.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">
                    {progress.title}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      progress.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : progress.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getStatusText(progress.status)}
                  </span>
                </div>

                {progress.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {progress.description}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex-1 mr-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {progress.progressPercent}%
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(progress.createdAt).toLocaleString("ko-KR")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
