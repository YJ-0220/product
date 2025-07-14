import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
import FormInput from "@/components/FormInput";
import { createWorkItem, getAcceptedApplication } from "@/api/order";
import type { ApplicationData } from "@/types/orderTypes";

interface WorkItemData {
  description: string;
  workLink: string;
  fileUrl: string;
}

export default function WorkItemForm() {
  const { id: applicationId } = useParams<{ id: string }>();
  // const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [acceptedApplication, setAcceptedApplication] = useState<ApplicationData | null>(null);

  const [formData, setFormData] = useState<WorkItemData>({
    description: "",
    workLink: "",
    fileUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 승인된 신청서 조회
  useEffect(() => {
    const fetchAcceptedApplication = async () => {
      if (!applicationId) return;
      
      try {
        setLoading(true);
        const application = await getAcceptedApplication(applicationId);
        setAcceptedApplication(application);
      } catch (error: any) {
        setError("승인된 신청서를 찾을 수 없습니다. 작업물을 제출할 권한이 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedApplication();
  }, [applicationId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("파일 크기는 10MB 이하여야 합니다.");
        return;
      }
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedApplication) {
      setError("승인된 신청서가 없습니다.");
      return;
    }
    
    if (!formData.description.trim()) {
      setError("작업물 설명을 입력해주세요.");
      return;
    }

    if (!formData.workLink.trim() && !selectedFile) {
      setError("작업물 링크 또는 파일을 제공해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      // TODO: 파일 업로드 API 구현 필요
      // const uploadedFileUrl = await uploadFile(selectedFile);
      
      const workItemData = {
        orderId: applicationId!,  
        applicationId: acceptedApplication.id,
        description: formData.description,
        workLink: formData.workLink,
        fileUrl: selectedFile ? "temp-file-url" : "", // 실제 업로드된 파일 URL로 교체
      };

      await createWorkItem(workItemData);

      setSuccess("작업물이 성공적으로 제출되었습니다.");
      setFormData({
        description: "",
        workLink: "",
        fileUrl: "",
      });
      setSelectedFile(null);
    } catch (error: any) {
      setError(error?.response?.data?.error || "작업물 제출에 실패했습니다.");
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

  if (!acceptedApplication) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            작업물 제출 권한이 없습니다
          </h2>
          <p className="text-gray-600">
            승인된 신청서가 없어 작업물을 제출할 수 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        작업물 제출
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      <div className="mb-6 p-4 bg-blue-50 rounded-md">
        <h3 className="font-semibold text-blue-900 mb-2">승인된 신청 정보</h3>
        <p className="text-sm text-blue-800">
          신청자: {acceptedApplication.seller.name}
        </p>
        {acceptedApplication.proposedPrice && (
          <p className="text-sm text-blue-800">
            제안 가격: {acceptedApplication.proposedPrice} 포인트
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="작업물 설명"
          name="description"
          value={formData.description}
          onChange={handleChange}
          type="textarea"
          rows={6}
        />

        <FormInput
          label="작업물 링크 (선택사항)"
          name="workLink"
          value={formData.workLink}
          onChange={handleChange}
          type="text"
        />

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            작업물 파일 (선택사항)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png,.gif"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
          <p className="text-xs text-gray-500">
            지원 형식: PDF, DOC, DOCX, ZIP, RAR, JPG, PNG, GIF (최대 10MB)
          </p>
          {selectedFile && (
            <p className="text-sm text-blue-600">
              선택된 파일: {selectedFile.name}
            </p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-semibold text-blue-900 mb-2">제출 안내</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 작업물 설명은 필수 입력 항목입니다.</li>
            <li>• 작업물 링크 또는 파일 중 하나는 반드시 제공해주세요.</li>
            <li>• 제출 후 수정이 어려우니 신중하게 작성해주세요.</li>
            <li>• 구매자가 작업물을 검토한 후 승인/반려 처리됩니다.</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
        >
          {isSubmitting ? "제출 중..." : "작업물 제출하기"}
        </button>
      </form>
    </div>
  );
}