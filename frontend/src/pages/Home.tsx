import { useAuthStore } from "@/hooks/store/useAuthStore";
import AdminHome from "@/pages/admin/AdminHome";
import BuyerHome from "@/pages/buyer/BuyerHome";
import SellerHome from "@/pages/seller/SellerHome";

const HomeContent: Record<string, React.ReactNode> = {
    admin: <AdminHome />,
    buyer: <BuyerHome />,
    seller: <SellerHome />,
  };

export default function Home() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div>기다리는 중...</div>;
  }
  if (!user) {
    return <div>로그인 후 이용해주세요.</div>;
  }

  const content = HomeContent[user.role];

  return <>{content}</>;
}