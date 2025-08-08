import { useCallback, useEffect, useState } from "react";
import { getCategories, getSubCategories } from "@/api/order";
import type { OrderCategory } from "@/types/orderTypes";
import { useLoading } from "./useLoading";

export function useCategories() {
  const [categories, setCategories] = useState<OrderCategory[]>([]);
  const [subcategories, setSubcategories] = useState<OrderCategory[]>([]);
  const { withLoading } = useLoading();

  const refreshCategories = useCallback(async () => {
    try {
      const categories = await withLoading(getCategories);
      setCategories(categories);
    } catch (err) {
      console.error("카테고리 불러오기 실패", err);
    }
  }, [withLoading]);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  const fetchSubcategories = async (parentId: number) => {
    try {
      const subcategories = await getSubCategories(parentId);
      setSubcategories(subcategories);
    } catch (err) {
      console.error("서브카테고리 불러오기 실패", err);
    }
  };

  return { categories, subcategories, fetchSubcategories, refreshCategories };
}
