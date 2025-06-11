import { useOrderRequestForm } from "@/hooks/useOrderRequestForm";

export default function OrderRequestForm() {
  const { formData, handleChange, handleSubmit } = useOrderRequestForm();

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-gray-800">작업 요청 등록</h2>

      {/* 카테고리 선택 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            카테고리
          </label>
          <select
            value={formData.category_id}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value={0}>카테고리를 선택하세요</option>
            {/* {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))} */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            세부 카테고리
          </label>
          <select
            name="subcategory_id"
            value={formData.subcategory_id}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg p-2"
            required
          >
            <option value="">선택</option>
            {/* TODO: 서브카테고리 데이터로 교체 */}
            <option value="1">영상홍보</option>
            <option value="2">댓글</option>
            <option value="3">채널 홍보</option>
            <option value="4">채널 홍보 댓글</option>
            <option value="5">블로그 홍보</option>
            <option value="6">블로그 홍보 댓글</option>
            <option value="7">카페 홍보</option>
            <option value="8">카페 홍보 댓글</option>
            <option value="9">인스타그램 홍보</option>
            <option value="10">인스타그램 홍보 댓글</option>
            <option value="11">X 홍보</option>
            <option value="12">X 홍보 댓글</option>
          </select>
        </div>
      </div>

      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-white">제목</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full mt-1 border rounded-lg p-2"
          placeholder="예: 로고 디자인 요청"
          required
        />
      </div>

      {/* 설명 */}
      <div>
        <label className="block text-sm font-medium text-white">설명</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full mt-1 border rounded-lg p-2"
          rows={5}
          placeholder="요청 상세 내용을 입력해주세요"
          required
        />
      </div>

      {/* 수량, 예산, 마감일 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-white">수량</label>
          <input
            type="number"
            name="desired_quantity"
            value={formData.desired_quantity}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg p-2"
            placeholder="예: 10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            예산 (₩)
          </label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg p-2"
            placeholder="예: 100000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">마감일</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition"
        >
          요청 등록하기
        </button>
      </div>
    </form>
  );
}
