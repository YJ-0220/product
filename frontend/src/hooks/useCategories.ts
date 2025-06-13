import { useEffect, useState } from "react";
import { getCategories } from "@/api/orderRequest";
import { useAuth } from "@/contexts/AuthContext";
import { type OrderCategory } from "@/types/orderCategory";

export function useCategories() {
  const [categories, setCategories] = useState<OrderCategory[]>([]);
  const { loading } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (err) {
        console.error("카테고리 불러오기 실패", err);
      }
    };

    fetchCategories();
  }, [loading]);

  return { categories };
}
