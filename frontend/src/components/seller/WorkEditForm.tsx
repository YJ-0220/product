import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormInput from "@/components/FormInput";
import {
  getOrderWorkItem,
  updateOrderWorkItem,
  getOrderApplicationsByOrder,
} from "@/api/order";
import type { ApplicationData } from "@/types/orderTypes";

interface WorkItemData {
  description: string;
  workLinks: string[];
  fileUrl: string;
}

export default function WorkEditForm() {
  const { orderId, applicationId, workItemId } = useParams<{
    orderId: string;
    applicationId: string;
    workItemId: string;
  }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [acceptedApplication, setAcceptedApplication] =
    useState<ApplicationData | null>(null);
  const [existingWorkItem, setExistingWorkItem] = useState<any>(null);

  const [formData, setFormData] = useState<WorkItemData>({
    description: "",
    workLinks: [""],
    fileUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId || !applicationId || !workItemId) {
        setError("주문 ID 또는 신청서 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 승인된 신청서 확인
        const applicationsData = await getOrderApplicationsByOrder(orderId);
        const targetApplication = applicationsData.find(
          (app: any) => app.id === applicationId && app.status === "accepted"
        );

        if (!targetApplication) {
          setError(
            "승인된 신청서를 찾을 수 없습니다. 작업물을 수정할 권한이 없습니다."
          );
          setLoading(false);
          return;
        }

        setAcceptedApplication(targetApplication);

        // 기존 작업물 조회
        try {
          const workItemData = await getOrderWorkItem(applicationId, workItemId);
          setExistingWorkItem(workItemData);
          
          // 기존 링크를 배열로 변환 (쉼표로 구분된 경우)
          const existingLinks = workItemData.workLink 
            ? workItemData.workLink.split(',').map((link: string) => link.trim()).filter((link: string) => link)
            : [""];
          
          setFormData({
            description: workItemData.description || "",
            workLinks: existingLinks.length > 0 ? existingLinks : [""],
            fileUrl: workItemData.fileUrl || "",
          });
        } catch (error: any) {
          setError("기존 작업물을 찾을 수 없습니다.");
        }
      } catch (error: any) {
        setError(
          "데이터를 불러올 수 없습니다: " +
            (error?.response?.data?.error || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, applicationId, workItemId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.workLinks];
    newLinks[index] = value;
    setFormData((prev) => ({
      ...prev,
      workLinks: newLinks,
    }));
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      workLinks: [...prev.workLinks, ""],
    }));
  };

  const removeLink = (index: number) => {
    if (formData.workLinks.length > 1) {
      const newLinks = formData.workLinks.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        workLinks: newLinks,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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

    // 링크가 하나도 입력되지 않았고 파일도 없는 경우
    const hasValidLinks = formData.workLinks.some(link => link.trim() !== "");
    if (!hasValidLinks && !selectedFile && !existingWorkItem?.fileUrl) {
      setError("작업물 링크 또는 파일을 제공해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      // let uploadedFileUrl = "";
      // if (selectedFile) {
      //   const uploadResult = await uploadFile(selectedFile);
      //   uploadedFileUrl = uploadResult.fileUrl;
      // }

      // 모든 링크를 쉼표로 구분하여 하나의 문자열로 합치기
      const validLinks = formData.workLinks.filter(link => link.trim() !== "");
      const workItemData = {
        description: formData.description,
        workLink: validLinks.join(', '),
        // fileUrl: uploadedFileUrl || existingWorkItem?.fileUrl,
      };

      await updateOrderWorkItem(applicationId!, workItemId!, workItemData);

      setSuccess("작업물이 성공적으로 수정되었습니다.");
      
      // 즉시 작업물 상세 페이지로 이동
      navigate(`/order/work/${workItemId}`);
    } catch (error: any) {
      setError(error?.response?.data?.error || "작업물 수정에 실패했습니다.");
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
            작업물 수정 권한이 없습니다
          </h2>
          <p className="text-gray-600">
            승인된 신청서가 없어 작업물을 수정할 수 없습니다.
          </p>
        </div>
      </div>
    );
  }

  if (!existingWorkItem) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            수정할 작업물이 없습니다
          </h2>
          <p className="text-gray-600">
            먼저 작업물을 제출한 후 수정할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900 mt-6">
        작업물 수정
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="작업물 설명"
          name="description"
          value={formData.description}
          onChange={handleChange}
          type="textarea"
          rows={6}
          placeholder="작업물 설명을 입력해주세요."
        />

        {/* 작업물 링크 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-900">
              작업물 링크 (선택사항)
            </label>
            <button
              type="button"
              onClick={addLink}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              링크 추가
            </button>
          </div>
          
          {formData.workLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                placeholder="작업물 링크를 입력해주세요 (예: https://example.com)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
              {formData.workLinks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>

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
          {existingWorkItem?.fileUrl && !selectedFile && (
            <p className="text-sm text-gray-600">
              기존 파일: {existingWorkItem.fileUrl}
            </p>
          )}
        </div>

        <div className="bg-yellow-50 p-4 rounded-md">
          <h3 className="font-semibold text-yellow-900 mb-2">수정 안내</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 작업물 설명은 필수 입력 항목입니다.</li>
            <li>• 작업물 링크 또는 파일 중 하나는 반드시 제공해주세요.</li>
            <li>• 링크는 여러 개 추가할 수 있습니다.</li>
            <li>• 수정 후 구매자가 작업물을 다시 검토합니다.</li>
            <li>• 수정 사항은 구매자에게 알림이 갑니다.</li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => navigate(`/order/work/${workItemId}`)}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-semibold"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {isSubmitting ? "수정 중..." : "작업물 수정하기"}
          </button>
        </div>
      </form>
    </div>
  );
} 