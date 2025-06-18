import { useState } from "react";
import { createOrderRequest, type OrderRequestData } from "@/api/order";
import { useNavigate } from "react-router-dom";

export function useOrderRequestForm() {
  const navigate = useNavigate();

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
    try {
      await createOrderRequest(formData);
      navigate("/order/success");
      setFormData({
        categoryId: 0,
        subcategoryId: 0,
        title: "",
        description: "",
        desiredQuantity: 0,
        requiredPoints: 0,
        deadline: "",
      });
    } catch {
      alert("주문 요청 실패");
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
}
