import { useOrderRequest } from "@/hooks/useOrderRequest";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

interface FormInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  rows?: number;
  options?: Array<{ id: number; name: string }>;
}

const FormInput = ({ label, name, value, onChange, type = "text", rows, options }: FormInputProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-900">{label}</label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      />
    ) : type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      >
        <option value={0}>선택</option>
        {options?.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      />
    )}
  </div>
);

export default function OrderRequestForm() {
  const { formData, error, isSubmitting, handleChange, handleSubmit } = useOrderRequest();
  const { categories, subcategories, fetchSubcategories } = useCategories();
  const { loading } = useAuth();

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
    }
  }, [formData.categoryId]);

  if (loading) return <p className="text-center text-gray-800 font-medium">로딩 중...</p>;

  return (
    <div className="w-full mx-auto mt-4 px-4 sm:px-6 lg:px-8">
      <div className="">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">주문 요청</h2>
        
        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
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
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput
              label="상위 카테고리"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              type="select"
              options={categories}
            />
            <FormInput
              label="하위 카테고리"
              name="subcategoryId"
              value={formData.subcategoryId}
              onChange={handleChange}
              type="select"
              options={formData.categoryId ? subcategories : []}
            />
          </div>

          <FormInput
            label="설명"
            name="description"
            value={formData.description}
            onChange={handleChange}
            type="textarea"
            rows={4}
          />

          <FormInput
            label="제목"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <FormInput
            label="수량"
            name="desiredQuantity"
            value={formData.desiredQuantity}
            onChange={handleChange}
            type="number"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput
              label="가격"
              name="requiredPoints"
              value={formData.requiredPoints}
              onChange={handleChange}
              type="number"
            />
            <FormInput
              label="마감일"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              type="date"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-4 px-10 rounded-md font-semibold text-lg transition-colors ${
                isSubmitting
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  처리 중...
                </div>
              ) : (
                "주문하기"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
