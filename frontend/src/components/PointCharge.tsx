import { useState } from "react";
import { chargePoint } from "@/api/points";
import { useAuth } from "@/context/AuthContext";

export default function PointCharge() {
  const [amount, setAmount] = useState<string>("");
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pointAmount = Number(amount);

    if (isNaN(pointAmount) || pointAmount <= 0) {
      alert("유효한 금액을 입력해주세요.");
      return;
    }

    try {
      const response = await chargePoint(pointAmount);
      user!.points = Number(response.newBalance);
      alert(response.message);
      setAmount("");
    } catch (error) {
      console.error("포인트 충전 실패:", error);
      alert("포인트 충전에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-black mb-4">
        포인트 충전
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-black mb-2"
          >
            충전할 포인트
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="충전할 포인트를 입력하세요"
            min="1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          충전하기
        </button>
      </form>
    </div>
  );
}
