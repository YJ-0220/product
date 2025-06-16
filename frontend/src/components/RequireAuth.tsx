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
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
}
