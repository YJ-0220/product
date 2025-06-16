import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import Admin from "@/pages/admin/Admin";
import Buyer from "@/pages/buyer/Buyer";
import Seller from "@/pages/seller/Seller";

const HomeContent: Record<string, React.ReactNode> = {
  admin: <Admin />,
  buyer: <Buyer />,
  seller: <Seller />,
};

export const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>기다리는 중...</div>;
  }
  if (!user) {
    return <div>로그인 후 이용해주세요.</div>;
  }

  const content = HomeContent[user.role];

  return (
    <Layout>
      {content}
    </Layout>
  );
};
