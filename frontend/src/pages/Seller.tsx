import { useAuth } from "@/contexts/AuthContext";

export default function Seller() {
  const { logout } = useAuth();
  return (
    <>
      <div>Seller페이지입니다.</div>
      <button
        onClick={logout}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        로그아웃
      </button>
    </>
  );
}
