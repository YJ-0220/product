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
  const { user } = useAuthStore();

  const content = HomeContent[user!.role];

  return <>{content}</>;
}
