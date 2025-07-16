import { useState, useEffect } from "react";
import { createPointWithdrawRequest, getBanks } from "@/api/points";
import type { Bank } from "@/types/pointRequestTypes";

export default function PointWithdrawForm() {
  const [amount, setAmount] = useState<string>("");
  const [bankId, setBankId] = useState<string>("");
  const [accountNum, setAccountNum] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await getBanks();
      setBanks(response.banks || []);
    } catch (error) {
      console.error("은행 목록 조회 실패:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pointAmount = Number(amount);

    if (isNaN(pointAmount) || pointAmount <= 0) {
      alert("유효한 금액을 입력해주세요.");
      return;
    }

    if (!bankId) {
      alert("은행을 선택해주세요.");
      return;
    }

    if (!accountNum.trim()) {
      alert("계좌번호를 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createPointWithdrawRequest({
        amount: pointAmount,
        bankId,
        accountNum,
      });
      alert(response.message);
      setAmount("");
      setBankId("");
      setAccountNum("");
    } catch (error) {
      console.error("포인트 환전 신청 실패:", error);
      alert("포인트 환전 신청에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-black mb-4">
        포인트 환전 신청
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900">
            환전 포인트
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900">
            은행명
          </label>
          <select
            value={bankId}
            onChange={(e) => setBankId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="" disabled>은행을 선택해주세요</option>
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900">
            계좌번호
          </label>
          <input
            type="text"
            value={accountNum}
            onChange={(e) => setAccountNum(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "환전 중..." : "환전 신청"}
        </button>
      </form>
    </div>
  );
}
