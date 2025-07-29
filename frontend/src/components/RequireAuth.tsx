import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/hooks/store/useAuthStore";
import type { ReactNode } from "react";

interface RequireAuthProps {
  allowedRoles: string[];
  children: ReactNode;
}

export default function RequireAuth({
  allowedRoles,
  children,
}: RequireAuthProps): ReactNode {
  const { isAuthenticated, user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (!user && !loading)) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
}
