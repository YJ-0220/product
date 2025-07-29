import React, { useState } from "react";
import { useAuthStore } from "@/hooks/store/useAuthStore";
import FormInput from "@/components/FormInput";

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 프론트엔드 유효성 검사 (각 필드에 표시)
    const newFieldErrors = { username: "", password: "" };
    if (!username.trim()) {
      newFieldErrors.username = "아이디를 입력해주세요";
    }
    if (!password.trim()) {
      newFieldErrors.password = "비밀번호를 입력해주세요";
    }

    if (newFieldErrors.username || newFieldErrors.password) {
      setFieldErrors(newFieldErrors);
      return;
    }

    // 제출할 때만 에러 초기화
    setFieldErrors({ username: "", password: "" });
    clearError();

    await login(username, password);
  };

  const handleInputChange =
    (field: "username" | "password") =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const value = e.target.value;

      if (field === "username") {
        setUsername(value);
        // 해당 필드의 에러만 초기화
        if (fieldErrors.username)
          setFieldErrors((prev) => ({ ...prev, username: "" }));
      } else {
        setPassword(value);
        // 해당 필드의 에러만 초기화
        if (fieldErrors.password)
          setFieldErrors((prev) => ({ ...prev, password: "" }));
      }

      // 입력할 때 백엔드 에러 초기화
      if (error) {
        clearError();
      }
    };

  // 아이콘 컴포넌트들
  const UserIcon = (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  const LockIcon = (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인</h1>
            <p className="text-gray-600">
              계정에 로그인하여 서비스를 이용하세요
            </p>
          </div>

          <div className="px-8 pb-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                label="아이디"
                name="username"
                type="text"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={handleInputChange("username")}
                error={fieldErrors.username}
                icon={!fieldErrors.username ? UserIcon : undefined}
              />

              <FormInput
                label="비밀번호"
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={handleInputChange("password")}
                error={fieldErrors.password}
                icon={!fieldErrors.password ? LockIcon : undefined}
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95 shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>로그인 중...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>로그인</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
