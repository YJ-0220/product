import { useState } from "react";
import { createOrderRequest, type OrderRequestData } from "@/api/orderRequest";
import { useNavigate } from "react-router-dom";

export function useOrderRequestForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OrderRequestData>({
    category_id: 0,
    subcategory_id: 0,
    title: "",
    description: "",
    desired_quantity: 0,
    required_points: 0,
    deadline: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev: OrderRequestData) => {
      // category_id가 바뀌면 subcategory_id 초기화
      if (name === "category_id") {
        return {
          ...prev,
          category_id: Number(value),
          subcategory_id: 0, // 초기화
        };
      }

      return {
        ...prev,
        [name]: [
          "category_id",
          "subcategory_id",
          "desired_quantity",
          "required_points",
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
      navigate("/order-success");
      setFormData({
        category_id: 0,
        subcategory_id: 0,
        title: "",
        description: "",
        desired_quantity: 0,
        required_points: 0,
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
