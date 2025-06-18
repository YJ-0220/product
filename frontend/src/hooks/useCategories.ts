import { useEffect, useState } from "react";
import { getCategories, getSubCategories } from "@/api/order";
import { useAuth } from "@/context/AuthContext";
import { type OrderCategory } from "@/types/orderCategory";

export function useCategories() {
  const [categories, setCategories] = useState<OrderCategory[]>([]);
  const [subcategories, setSubcategories] = useState<OrderCategory[]>([]);
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

  const fetchSubcategories = async (parentId: number) => {
    try {
      const subcategories = await getSubCategories(parentId);
      setSubcategories(subcategories);
    } catch (err) {
      console.error("서브카테고리 불러오기 실패", err);
    }
  };

  return { categories, subcategories, fetchSubcategories };
}
