import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

interface RequireAuthProps {
  allowedRoles: string[];
}

export default function RequireAuth({
  allowedRoles,
}: RequireAuthProps): ReactNode {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
}
