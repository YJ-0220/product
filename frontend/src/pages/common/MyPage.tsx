import { useMyPageData } from "@/hooks/useMyPageData";
import TabNavigation from "@/components/mypage/TabNavigation";
import ProfileTab from "@/components/mypage/ProfileTab";
import PointHistoryTab from "@/components/mypage/PointHistoryTab";
import ChargeHistoryTab from "@/components/mypage/ChargeHistoryTab";
import AdminApprovalsTab from "@/components/mypage/AdminApprovalsTab";
import AdminTransactionsTab from "@/components/mypage/AdminTransactionsTab";

export default function MyPage() {
  const {
    user,
    activeTab,
    setActiveTab,
    loading,
    fetchData,
    chargeRequests,
    withdrawRequests,
    pointHistory,
    allTransactions,
    adminChargeRequests,
    adminWithdrawRequests,
  } = useMyPageData();

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab user={user} />;

      case "points":
        return (
          <PointHistoryTab
            pointHistory={pointHistory}
            loading={loading}
            onRefresh={fetchData}
          />
        );

      case "charge-history":
        return (
          <ChargeHistoryTab
            user={user}
            chargeRequests={chargeRequests}
            withdrawRequests={withdrawRequests}
            loading={loading}
            onRefresh={fetchData}
          />
        );

      case "admin-approvals":
        return (
          <AdminApprovalsTab
            adminChargeRequests={adminChargeRequests}
            adminWithdrawRequests={adminWithdrawRequests}
            loading={loading}
            onRefresh={fetchData}
          />
        );

      case "admin-transactions":
        return (
          <AdminTransactionsTab
            allTransactions={allTransactions}
            loading={loading}
            onRefresh={fetchData}
          />
        );

      default:
        return <ProfileTab user={user} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">마이 페이지</h1>

        <div className="bg-white rounded-lg shadow-md mb-8">
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
          />

          <div className="p-6">{renderTabContent()}</div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            총{" "}
            <span className="font-semibold text-gray-900">
              {user?.role === "admin"
                ? allTransactions.length ||
                  adminChargeRequests.length + adminWithdrawRequests.length
                : pointHistory.length ||
                  chargeRequests.length + withdrawRequests.length}
            </span>
            건의 기록이 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
