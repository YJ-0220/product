import { useState, useEffect } from "react";
import { createPointWithdrawRequest, getBanks } from "@/api/points";
import type { Bank } from "@/types/pointRequestTypes";

export default function PointWithdrawForm() {
  const [amount, setAmount] = useState<string>("");
  const [bankId, setBankId] = useState<string>("");
  const [accountNum, setAccountNum] = useState<string>("");
  const [accountHolderName, setAccountHolderName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [banksError, setBanksError] = useState<string | null>(null);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setIsLoadingBanks(true);
      setBanksError(null);
      const response = await getBanks();
      setBanks(response.banks || []);
    } catch (error: any) {
      console.error("은행 목록 조회 실패:", error);
      const errorMessage = error.response?.data?.message || "은행 목록을 불러오는데 실패했습니다.";
      setBanksError(errorMessage);
      // 재시도 버튼을 위해 빈 배열로 설정
      setBanks([]);
    } finally {
      setIsLoadingBanks(false);
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

    if (!accountHolderName.trim()) {
      alert("예금주명을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createPointWithdrawRequest({
        amount: pointAmount,
        bankId,
        accountNum,
        accountHolderName: accountHolderName.trim(),
      });
      alert(response.message);
      setAmount("");
      setBankId("");
      setAccountNum("");
      setAccountHolderName("");
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
          {isLoadingBanks ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500">
              은행 목록을 불러오는 중...
            </div>
          ) : banksError ? (
            <div>
              <div className="w-full px-4 py-3 border border-red-300 rounded-md bg-red-50 text-red-700 mb-2">
                {banksError}
              </div>
              <button
                type="button"
                onClick={fetchBanks}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <select
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              disabled={banks.length === 0}
            >
              <option value="" disabled>
                {banks.length === 0 ? "은행 목록이 없습니다" : "은행을 선택해주세요"}
              </option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          )}
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
        <div>
          <label className="block text-sm font-semibold text-gray-900">
            예금주명
          </label>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || isLoadingBanks || banks.length === 0}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "환전 중..." : isLoadingBanks ? "은행 정보 로딩 중..." : "환전 신청"}
        </button>
      </form>
    </div>
  );
}
