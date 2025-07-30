import { useTransactionUtils } from "@/hooks/useTransactionUtils";
import type { PointTransaction } from "@/types/myPageTypes";

interface AdminTransactionsTabProps {
  allTransactions: PointTransaction[];
  loading: boolean;
  onRefresh: () => void;
}

export default function AdminTransactionsTab({
  allTransactions,
  loading,
  onRefresh,
}: AdminTransactionsTabProps) {
  const {
    getTransactionTypeText,
    getTransactionTypeColor,
    getRoleBadgeClass,
    getRoleText,
  } = useTransactionUtils();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          전체 포인트 거래 내역
        </h3>
        <button
          onClick={onRefresh}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          새로고침
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      ) : allTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">포인트 거래 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  날짜
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  포인트
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  설명
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.user?.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeClass(
                        transaction.user?.role || ""
                      )}`}
                    >
                      {getRoleText(transaction.user?.role || "")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "ko-KR"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${getTransactionTypeColor(
                        transaction.type
                      )}`}
                    >
                      {getTransactionTypeText(transaction.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.amount > 0
                      ? `+${transaction.amount.toLocaleString()}P`
                      : `-${Math.abs(transaction.amount).toLocaleString()}P`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.description || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
