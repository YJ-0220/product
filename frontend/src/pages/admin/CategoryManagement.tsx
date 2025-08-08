import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import {
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
  getSubCategories,
  createSubcategory as apiCreateSubcategory,
  updateSubcategory as apiUpdateSubcategory,
  deleteSubcategory as apiDeleteSubcategory,
} from "@/api/order";

export default function CategoryManagement() {
  const { categories, refreshCategories } = useCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [subcategories, setSubcategories] = useState<
    { id: number; name: string }[]
  >([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    const loadSubs = async () => {
      if (selectedCategoryId) {
        const subs = await getSubCategories(selectedCategoryId);
        setSubcategories(subs);
      } else {
        setSubcategories([]);
      }
    };
    loadSubs();
  }, [selectedCategoryId]);

  return (
    <div className="px-6 py-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">카테고리 관리</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="새 카테고리명"
                className="border rounded px-3 py-2"
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={async () => {
                  if (!newCategory.trim()) return;
                  await apiCreateCategory(newCategory.trim());
                  setNewCategory("");
                  setSelectedCategoryId(null);
                  await refreshCategories();
                }}
              >
                추가
              </button>
            </div>

            <div className="rounded border border-gray-100 max-h-[420px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이름
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {categories.map((c) => (
                    <tr
                      key={c.id}
                      className={`hover:bg-gray-50 ${
                        selectedCategoryId === c.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {editingCategory?.id === c.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={editingCategory.name}
                              onChange={(e) =>
                                setEditingCategory({
                                  ...editingCategory,
                                  name: e.target.value,
                                })
                              }
                              className="border rounded px-2 py-1"
                            />
                            <button
                              className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                              onClick={async () => {
                                await apiUpdateCategory(
                                  c.id,
                                  editingCategory.name.trim()
                                );
                                setEditingCategory(null);
                                await refreshCategories();
                              }}
                            >
                              저장
                            </button>
                            <button
                              className="px-2 py-1 bg-gray-200 rounded text-xs"
                              onClick={() => setEditingCategory(null)}
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              className="text-left underline"
                              onClick={() => setSelectedCategoryId(c.id)}
                            >
                              {c.name}
                            </button>
                            <button
                              className="px-2 py-1 bg-gray-100 rounded text-xs"
                              onClick={() => setEditingCategory(c)}
                            >
                              수정
                            </button>
                            <button
                              className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                              onClick={async () => {
                                if (
                                  !confirm(
                                    "이 카테고리를 삭제하시겠습니까? 하위 서브카테고리도 함께 삭제됩니다."
                                  )
                                )
                                  return;
                                await apiDeleteCategory(c.id);
                                if (selectedCategoryId === c.id)
                                  setSelectedCategoryId(null);
                                await refreshCategories();
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                서브카테고리
              </h2>
              <div>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={selectedCategoryId ?? ""}
                  onChange={(e) =>
                    setSelectedCategoryId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                >
                  <option value="">상위 카테고리 선택</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCategoryId ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    placeholder="새 서브카테고리명"
                    className="border rounded px-3 py-2"
                  />
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={async () => {
                      if (!newSubcategory.trim()) return;
                      await apiCreateSubcategory(
                        selectedCategoryId,
                        newSubcategory.trim()
                      );
                      setNewSubcategory("");
                      const subs = await getSubCategories(selectedCategoryId);
                      setSubcategories(subs);
                      await refreshCategories();
                    }}
                  >
                    추가
                  </button>
                </div>

                <div className="rounded border border-gray-100 max-h-[420px] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          이름
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {subcategories.map((s) => (
                        <tr key={s.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {editingSubcategory?.id === s.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  value={editingSubcategory.name}
                                  onChange={(e) =>
                                    setEditingSubcategory({
                                      ...editingSubcategory,
                                      name: e.target.value,
                                    })
                                  }
                                  className="border rounded px-2 py-1"
                                />
                                <button
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                                  onClick={async () => {
                                    await apiUpdateSubcategory(
                                      selectedCategoryId,
                                      s.id,
                                      editingSubcategory.name.trim()
                                    );
                                    setEditingSubcategory(null);
                                    const subs = await getSubCategories(
                                      selectedCategoryId
                                    );
                                    setSubcategories(subs);
                                    await refreshCategories();
                                  }}
                                >
                                  저장
                                </button>
                                <button
                                  className="px-2 py-1 bg-gray-200 rounded text-xs"
                                  onClick={() => setEditingSubcategory(null)}
                                >
                                  취소
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span>{s.name}</span>
                                <button
                                  className="px-2 py-1 bg-gray-100 rounded text-xs"
                                  onClick={() => setEditingSubcategory(s)}
                                >
                                  수정
                                </button>
                                <button
                                  className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                                  onClick={async () => {
                                    if (
                                      !confirm(
                                        "이 서브카테고리를 삭제하시겠습니까?"
                                      )
                                    )
                                      return;
                                    await apiDeleteSubcategory(
                                      selectedCategoryId,
                                      s.id
                                    );
                                    const subs = await getSubCategories(
                                      selectedCategoryId
                                    );
                                    setSubcategories(subs);
                                    await refreshCategories();
                                  }}
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-gray-500">
                상위 카테고리를 먼저 선택하세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
