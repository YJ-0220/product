import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";

export default function LoginForm() {
  const { login, error } = useLogin();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(username, password);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-[400px] pb-10 items-center border-2 border-[#00fcfc] rounded-2xl">
        <div className="flex flex-col items-center justify-center">
          <h1 className="items-center justify-center py-10 font-black text-2xl">
            홈페이지 제목이요
          </h1>
          <form onSubmit={handleSubmit} className="w-full px-8">
            <input
              type="text"
              placeholder="아이디를 입력해주세요"
              className="w-full bg-gray-900 border border-white rounded-md p-2 "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              className="w-full bg-gray-900 border border-white rounded-md p-2 mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-2 px-4 rounded-md text-white font-semibold
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"}
                transition-colors duration-200`}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
            {error && (
              <div className="text-red-500 mb-4 text-center">{error}</div>
            )}
            <div className="mt-4">
              <input type="checkbox" name="로그인 유지" />
              <label className="pl-2">
                <span className="font-normal">로그인 유지</span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
