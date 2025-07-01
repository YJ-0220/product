import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

interface RequireAuthProps {
  allowedRoles: string[];
  children: ReactNode;
}

export default function RequireAuth({
  allowedRoles,
  children,
}: RequireAuthProps): ReactNode {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user && !loading) {
    return <Navigate to="/not-found" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
}
