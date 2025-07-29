import { useAuthStore } from "@/hooks/store/useAuthStore";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface RequireNoAuthProps {
  children: ReactNode;
}

export default function RequireNoAuth({ children }: RequireNoAuthProps) {
  const { isAuthenticated, user, loading } = useAuthStore();

  const roleHomeMap: Record<string, string> = {
    admin: "/",
    seller: "/",
    buyer: "/",
  };

  if (loading) {
    return null;
  }

  if (isAuthenticated && user) {
    const redirectPath = roleHomeMap[user.role] || "/not-found";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
