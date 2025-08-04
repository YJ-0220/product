import { Link } from "react-router-dom";
import KPICharts from "@/components/admin/KPICharts";

export default function AdminHome() {
  return (
    <div className="p-6">
      <KPICharts />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">최근 주문</h3>
            <Link
              to="/order"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              전체보기
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            빠른 작업
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/users/point-requests"
              className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <div className="text-center">
                <span className="text-sm font-medium text-blue-700">
                  포인트 관리
                </span>
              </div>
            </Link>

            <Link
              to="/users"
              className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <div className="text-center">
                <span className="text-sm font-medium text-green-700">
                  사용자 관리
                </span>
              </div>
            </Link>

            <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <div className="text-center">
                <span className="text-sm font-medium text-purple-700">
                  메뉴3
                </span>
              </div>
            </button>

            <button className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
              <div className="text-center">
                <span className="text-sm font-medium text-orange-700">
                  메뉴4
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
