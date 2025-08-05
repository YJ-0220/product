import type { TabType } from "@/types/myPageTypes";
import type { User } from "@/types/userTypes";

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: User | null;
}

export default function TabNavigation({
  activeTab,
  setActiveTab,
  user,
}: TabNavigationProps) {
  const getTabClassName = (tabName: TabType) =>
    `py-4 px-1 border-b-2 font-medium text-sm ${
      activeTab === tabName
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 px-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={getTabClassName("profile")}
        >
          프로필
        </button>

        <button
          onClick={() => setActiveTab("points")}
          className={getTabClassName("points")}
        >
          포인트 내역
        </button>

        {user?.role !== "admin" && (
          <button
            onClick={() => setActiveTab("charge-history")}
            className={getTabClassName("charge-history")}
          >
            {user?.role === "seller" ? "환전 신청 내역" : "충전 신청 내역"}
          </button>
        )}

        {user?.role === "admin" && (
          <>
            <button
              onClick={() => setActiveTab("admin-approvals")}
              className={getTabClassName("admin-approvals")}
            >
              승인 내역
            </button>
            <button
              onClick={() => setActiveTab("admin-transactions")}
              className={getTabClassName("admin-transactions")}
            >
              전체 거래 내역
            </button>
          </>
        )}
      </nav>
    </div>
  );
}
