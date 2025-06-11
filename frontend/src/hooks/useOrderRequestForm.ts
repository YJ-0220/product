import { useState } from "react";
import { createOrderRequest, type OrderRequestData } from "@/api/orderRequest";

export function useOrderRequestForm() {
  const [formData, setFormData] = useState<OrderRequestData>({
    category_id: 0,
    subcategory_id: 0,
    title: "",
    description: "",
    desired_quantity: 0,
    budget: 0,
    deadline: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: OrderRequestData) => ({
      ...prev,
      [name]: [
        "desired_quantity",
        "budget",
        "category_id",
        "subcategory_id",
      ].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrderRequest(formData);
      alert("주문 요청이 등록되었습니다!");
      setFormData({
        category_id: 0,
        subcategory_id: 0,
        title: "",
        description: "",
        desired_quantity: 0,
        budget: 0,
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
