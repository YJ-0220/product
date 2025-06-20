import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center mt-10">
      <div className="max-w-md w-full">
        <div
          className={`bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-700 ${
            showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div
            className={`mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 transition-all duration-1000 ${
              showAnimation ? "scale-100 rotate-0" : "scale-0 rotate-180"
            }`}
          >
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1
            className={`text-3xl font-bold text-gray-900 mb-4 transition-all duration-700 delay-300 ${
              showAnimation
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            주문 완료!
          </h1>

          <p
            className={`text-gray-600 mb-8 transition-all duration-700 delay-500 ${
              showAnimation
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            주문이 성공적으로 접수되었습니다.
          </p>

          <div
            className={`bg-blue-50 rounded-lg p-4 mb-8 transition-all duration-700 delay-700 ${
              showAnimation
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-blue-800 font-medium">
                포인트가 차감되었습니다
              </span>
            </div>
          </div>

          <div
            className={`space-y-4 transition-all duration-700 delay-1000 ${
              showAnimation
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <button
              onClick={() => navigate("/order")}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>주문 목록 보기</span>
            </button>

            <button
              onClick={() => navigate("/order/request")}
              className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>새 주문 작성</span>
            </button>
          </div>

          <div
            className={`mt-8 pt-6 border-t border-gray-200 transition-all duration-700 delay-1200 ${
              showAnimation
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <p className="text-sm text-gray-500">
              주문 상태는 주문 목록에서 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
