import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

interface RequireAuthProps {
  allowedRoles: string[];
}

export default function RequireAuth({
  allowedRoles,
}: RequireAuthProps): ReactNode {
  const { isAuthenticated, role } = useAuth();

  // 로그인 상태 확인
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 역할이 없는 경우 로딩중 표시
  if (role === null) {
    return <div>로딩중....</div>;
  }

  // 권한 확인
  if (!allowedRoles.includes(role)) {
    alert("권한이 없습니다.");
    return <Navigate to={`/${role}`} replace />;
  }

  return <Outlet />;
}
