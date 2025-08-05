import { Line, Doughnut, Bar } from "react-chartjs-2";
import { useKPIData } from "@/hooks/useKPIData";

export default function KPICharts() {
  const { kpiData, loading, error, refetch } = useKPIData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-800">
            <svg
              className="w-5 h-5 mr-2 inline"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
        <button
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!kpiData) return null;

  const userGrowthChartData = {
    labels: kpiData.userGrowth.labels,
    datasets: [
      {
        label: "새 회원가입",
        data: kpiData.userGrowth.data,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const orderStatusChartData = {
    labels: kpiData.orderStatus.labels,
    datasets: [
      {
        data: kpiData.orderStatus.data,
        backgroundColor: ["#FEF3C7", "#DBEAFE", "#D1FAE5", "#FEE2E2"],
        borderColor: ["#F59E0B", "#3B82F6", "#10B981", "#EF4444"],
        borderWidth: 2,
      },
    ],
  };

  const userRoleChartData = {
    labels: kpiData.userRole.labels,
    datasets: [
      {
        label: "사용자 수",
        data: kpiData.userRole.data,
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(168, 85, 247)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">관리자 대시보드</h2>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          새로고침
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            사용자 증가 추이 (최근 7일)
          </h3>
          <div className="h-64 mt-4 flex items-center justify-center">
            <Line data={userGrowthChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            주문 상태별 분포
          </h3>
          <div className="h-64 mt-4 flex items-center justify-center">
            <Doughnut data={orderStatusChartData} options={doughnutOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            사용자 역할별 분포
          </h3>
          <div className="h-64 mt-4 flex items-center justify-center">
            <Bar data={userRoleChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            포인트 거래 통계 (최근 30일)
          </h3>
          <div className="space-y-3 mt-4">
            {kpiData.pointTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      transaction.type === "charge"
                        ? "bg-green-500"
                        : transaction.type === "withdraw"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <span className="font-medium">
                    {transaction.type === "charge"
                      ? "충전"
                      : transaction.type === "withdraw"
                      ? "환전"
                      : "기타"}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {transaction.totalAmount.toLocaleString()}원
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.count}건
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
