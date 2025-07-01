import { useState } from "react";
import { createOrderRequest } from "@/api/order";
import { useNavigate } from "react-router-dom";
import type { OrderRequestData } from "@/types/orderTypes";

export function useOrderRequestForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OrderRequestData>({
    categoryId: 0,
    subcategoryId: 0,
    title: "",
    description: "",
    desiredQuantity: 0,
    requiredPoints: 0,
    deadline: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // 에러 메시지 초기화
    if (error) {
      setError("");
    }

    setFormData((prev: OrderRequestData) => {
      // categoryId가 바뀌면 subcategoryId 초기화
      if (name === "categoryId") {
        return {
          ...prev,
          categoryId: Number(value),
          subcategoryId: 0, // 초기화
        };
      }

      return {
        ...prev,
        [name]: [
          "categoryId",
          "subcategoryId",
          "desiredQuantity",
          "requiredPoints",
        ].includes(name)
          ? Number(value)
          : value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    const validations = [
      { condition: !formData.categoryId, message: "카테고리를 선택해주세요." },
      { condition: !formData.subcategoryId, message: "하위 카테고리를 선택해주세요." },
      { condition: !formData.title.trim(), message: "제목을 입력해주세요." },
      { condition: formData.desiredQuantity <= 0, message: "수량을 입력해주세요." },
      { condition: !formData.deadline, message: "마감일을 선택해주세요." },
    ];

    const firstError = validations.find(validation => validation.condition);
    if (firstError) {
      setError(firstError.message);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      
      await createOrderRequest(formData);
      navigate("/order/success");
      
      // 폼 초기화
      setFormData({
        categoryId: 0,
        subcategoryId: 0,
        title: "",
        description: "",
        desiredQuantity: 0,
        requiredPoints: 0,
        deadline: "",
      });
    } catch (error: any) {
      // 서버에서 오는 에러 메시지 처리
      const errorMessage = error?.response?.data?.message || "주문 요청에 실패했습니다. 다시 시도해주세요.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  return {
    formData,
    error,
    isSubmitting,
    handleChange,
    handleSubmit,
    clearError,
  };
}
