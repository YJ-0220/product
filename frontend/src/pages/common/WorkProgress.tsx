import { useAuth } from "@/context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import WorkProgressForm from "@/components/seller/WorkProgressForm";
import WorkProgressView from "@/components/common/WorkProgressView";

export default function WorkProgress() {
  const { user } = useAuth();
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    if (user?.role === "seller") {
      navigate("/order/work");
    } else {
      navigate(`/order/${orderId}`);
    }
  };

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === "seller" ? "내 작업 진행 상황" : "작업 진행 상황"}
        </h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          뒤로 가기
        </button>
      </div>

      {user?.role === "seller" ? <WorkProgressForm /> : <WorkProgressView />}
    </div>
  );
}
