export const useUtils = () => {
  const getStatusText = (status: string) => {
    switch (status) {
      case "submitted":
        return "제출됨";
      case "approved":
      case "accepted":
        return "승인됨";
      case "rejected":
        return "거절됨";
      case "pending":
        return "대기중";
      case "progress":
        return "진행중";
      case "completed":
        return "완료됨";
      case "cancelled":
        return "취소됨";
      case "not_started":
        return "시작 전";
      case "in_progress":
        return "진행중";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "accepted":
      case "completed":
        return "bg-green-100 text-green-800";
      case "submitted":
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "progress":
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "not_started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    getStatusText,
    getStatusColor,
    formatDate,
  };
}; 