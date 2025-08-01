import { useOrderRequest } from "@/hooks/useOrderRequest";
import { useCategories } from "@/hooks/useCategories";
import { useAuthStore } from "@/hooks/store/useAuthStore";
import { useEffect } from "react";
import FormInput from "@/components/FormInput";
import { useNavigate } from "react-router-dom";

export default function OrderRequestForm() {
  const navigate = useNavigate();
  const { formData, error, isSubmitting, handleChange, handleSubmit } =
    useOrderRequest();
  const { categories, subcategories, fetchSubcategories } = useCategories();
  const { loading } = useAuthStore();

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
    }
  }, [formData.categoryId]);

  if (loading)
    return <p className="text-center text-gray-800 font-medium">로딩 중...</p>;

  return (
    <div className="w-full mx-auto mt-4 px-4 sm:px-6 lg:px-8">
      <div className="">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">주문 요청</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
            onClick={() => {
              navigate("/order");
            }}
          >
            게시판으로 돌아가기
          </button>
        </div>

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
              label="SNS"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              type="select"
              options={categories}
            />
            <FormInput
              label="서비스"
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
          <FormInput
            label="가격"
            name="requiredPoints"
            value={formData.requiredPoints}
            onChange={handleChange}
            type="number"
          />

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
