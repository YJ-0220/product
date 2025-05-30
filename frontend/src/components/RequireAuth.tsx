import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface RequireAuthProps {
  allowedRoles: string[];
}

export default function RequireAuth({
  allowedRoles,
}: RequireAuthProps): ReactNode {
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (isAuthenticated && role && !allowedRoles.includes(role)) {
      alert("접근 권한이 없습니다.");
      window.history.back();
    }
  }, [isAuthenticated, role, allowedRoles]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === null) {
    return <div>로딩중....</div>;
  }

  if (!allowedRoles.includes(role)) {
    return null;
  }

  return <Outlet />;
}
