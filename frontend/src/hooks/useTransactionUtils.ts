export const useTransactionUtils = () => {
  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case "charge":
        return "충전";
      case "earn":
        return "적립";
      case "spend":
        return "사용";
      case "withdraw":
        return "출금";
      case "admin_adjust":
        return "관리자 조정";
      default:
        return type;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "charge":
      case "earn":
        return "text-green-600";
      case "spend":
      case "withdraw":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "buyer":
        return "bg-blue-100 text-blue-800";
      case "seller":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "buyer":
        return "구매자";
      case "seller":
        return "판매자";
      case "admin":
        return "관리자";
      default:
        return role;
    }
  };

  return {
    getTransactionTypeText,
    getTransactionTypeColor,
    getRoleBadgeClass,
    getRoleText,
  };
};