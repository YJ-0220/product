import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireNoAuth() {
  const { isAuthenticated, user, loading } = useAuth();

  const roleHomeMap: Record<string, string> = {
    admin: "/admin",
    seller: "/seller",
    buyer: "/buyer",
  };

  if (loading) {
    return null;
  }

  if (isAuthenticated && user) {
    const redirectPath = roleHomeMap[user.role] || "/not-found";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}