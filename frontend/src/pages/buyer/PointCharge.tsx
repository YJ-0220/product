import { useState } from "react";
import { createPointChargeRequest } from "@/api/points";

export default function PointCharge() {
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pointAmount = Number(amount);

    if (isNaN(pointAmount) || pointAmount <= 0) {
      alert("유효한 금액을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createPointChargeRequest(pointAmount);
      alert(response.message);
      setAmount("");
    } catch (error) {
      console.error("포인트 충전 신청 실패:", error);
      alert("포인트 충전 신청에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-black mb-4">
        포인트 충전 신청
      </h2>
      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          충전 신청을 하시면 관리자가 검토 후에 포인트가 충전됩니다.  
          <br />
          계좌 번호: 123-45-67890
          <br />
          은행: 국민은행
          <br />
          예금주: 홍길동
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-black mb-2"
          >
            충전 신청할 포인트
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="원하시는 포인트를 입력해주세요"
            min="1"
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "신청 중..." : "충전 신청하기"}
        </button>
      </form>
    </div>
  );
}
