import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormInput from "@/components/FormInput";
import {
  createOrderWorkSubmit,
  getOrderApplicationsByOrder,
  getOrderWorkList,
  // uploadFile,
} from "@/api/order";
import type { ApplicationData } from "@/types/orderTypes";

interface WorkItemData {
  description: string;
  workLinks: string[];
  fileUrl: string;
}

export default function WorkSubmitForm() {
  const { orderId, applicationId } = useParams<{
    orderId: string;
    applicationId: string;
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
    const fetchAcceptedApplication = async () => {
      if (!orderId || !applicationId) {
        setError("주문 ID 또는 신청서 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const applicationsData = await getOrderApplicationsByOrder(orderId);
        const targetApplication = applicationsData.find(
          (app: any) => app.id === applicationId && app.status === "accepted"
        );

        if (targetApplication) {
          setAcceptedApplication(targetApplication);
          
          // 기존 작업물이 있는지 확인
          try {
            const workItemData = await getOrderWorkList();
            setExistingWorkItem(workItemData[0] || null);
          } catch (error) {
            // 기존 작업물이 없으면 무시 (새로 제출하는 경우)
            setExistingWorkItem(null);
          }
        } else {
          setError(
            "승인된 신청서를 찾을 수 없습니다. 작업물을 제출할 권한이 없습니다."
          );
        }
      } catch (error: any) {
        setError(
          "승인된 신청서를 찾을 수 없습니다. 작업물을 제출할 권한이 없습니다. 에러: " +
            (error?.response?.data?.error || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedApplication();
  }, [orderId, applicationId]);

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
    if (!hasValidLinks && !selectedFile) {
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
        // fileUrl: uploadedFileUrl,
      };

      await createOrderWorkSubmit(orderId!, workItemData);

      setSuccess("작업물이 성공적으로 제출되었습니다.");
      setFormData({
        description: "",
        workLinks: [""],
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
    <div className="rounded-lg shadow-md">
      <div className="flex justify-between items-center mt-6 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {existingWorkItem ? "작업물 재제출" : "작업물 제출"}
        </h2>
        {existingWorkItem && (
          <button
            type="button"
            onClick={() => navigate(`/order/work/${existingWorkItem.id}/edit`)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            작업물 수정
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm mb-3">{success}</p>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/order/work/${existingWorkItem?.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              작업물 상세 보기
            </button>
            <button
              type="button"
              onClick={() => navigate("/order/work")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              작업 게시판으로
            </button>
            <button
              type="button"
              onClick={() => navigate(`/order/${orderId}`)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
            >
              주문 상세 보기
            </button>
          </div>
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
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-semibold text-blue-900 mb-2">제출 안내</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 작업물 설명은 필수 입력 항목입니다.</li>
            <li>• 작업물 링크 또는 파일 중 하나는 반드시 제공해주세요.</li>
            <li>• 링크는 여러 개 추가할 수 있습니다.</li>
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
