import { useState } from "react";
import { adminRegister } from "@/api/admin";
import { Link } from "react-router-dom";

interface CreateAccountForm {
  username: string;
  password: string;
  role: "buyer" | "seller";
  membershipLevel: "bronze" | "silver" | "gold" | "platinum" | "vip";
}

export default function UserCreate() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [formData, setFormData] = useState<CreateAccountForm>({
    username: "",
    password: "",
    role: "buyer",
    membershipLevel: "bronze",
  });

  // 계정 생성
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.username || !formData.password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setCreating(true);
      const requestData: any = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
      };

      // 구매자일 때만 멤버십 등급 포함
      if (formData.role === "buyer") {
        requestData.membershipLevel = formData.membershipLevel;
      }

      await adminRegister(requestData);
      
      setSuccess("계정이 성공적으로 생성되었습니다.");
      setFormData({ username: "", password: "", role: "buyer", membershipLevel: "bronze" });
    } catch (error: any) {
      setError(error?.response?.data?.message || "계정 생성에 실패했습니다.");
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">새 계정 생성</h1>
        <Link
          to="/users"
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          사용자 목록으로
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleCreateAccount} className="space-y-6">
          {/* 아이디 */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              아이디 *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="사용자 아이디 입력"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="8자 이상, 영문/숫자/특수문자 포함"
              required
            />
            <p className="mt-1 text-sm text-gray-600">
              영문, 숫자, 특수문자(@$!%*?&)를 포함한 8자 이상
            </p>
          </div>

          {/* 역할 선택 */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              역할 *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="buyer">구매자 (Buyer)</option>
              <option value="seller">판매자 (Seller)</option>
            </select>
          </div>

          {/* 멤버십 등급 선택 (구매자만 해당) */}
          {formData.role === "buyer" && (
            <div>
              <label htmlFor="membershipLevel" className="block text-sm font-medium text-gray-700 mb-2">
                멤버십 등급
              </label>
              <select
                id="membershipLevel"
                name="membershipLevel"
                value={formData.membershipLevel}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bronze">브론즈 (Bronze)</option>
                <option value="silver">실버 (Silver)</option>
                <option value="gold">골드 (Gold)</option>
                <option value="platinum">플래티넘 (Platinum)</option>
                <option value="vip">VIP (VIP)</option>
              </select>
              <p className="mt-1 text-sm text-gray-600">
                구매자의 초기 멤버십 등급을 선택해주세요
              </p>
            </div>
          )}

          {/* 에러/성공 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-600 text-sm font-medium">{success}</p>
              </div>
            </div>
          )}

          {/* 생성 버튼 */}
          <button
            type="submit"
            disabled={creating}
            className="w-full px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 transition-colors"
          >
            {creating ? (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                생성 중...
              </div>
            ) : (
              "계정 생성"
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 