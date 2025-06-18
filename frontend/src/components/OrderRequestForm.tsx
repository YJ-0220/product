import { useOrderRequestForm } from "@/hooks/useOrderRequestForm";
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
  const { formData, handleChange, handleSubmit } = useOrderRequestForm();
  const { categories, subcategories, fetchSubcategories } = useCategories();
  const { loading } = useAuth();

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
    }
  }, [formData.categoryId]);

  if (loading) return <p className="text-center text-gray-800 font-medium">로딩 중...</p>;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">주문 요청</h2>
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

          <div className="max-w-2xl mx-auto">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-semibold text-lg"
            >
              주문하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
