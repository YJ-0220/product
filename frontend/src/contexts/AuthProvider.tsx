import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { getUserProfile } from "@/api/user";

interface User {
  id: string;
  name: string;
  membershipLevel?: string;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 초기 상태를 localStorage에서 가져오도록 수정
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    return !!(token && savedRole);
  });

  const [role, setRole] = useState<string | null>(() => {
    return localStorage.getItem("role");
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const res = await getUserProfile();
          setUser(res.user);
        } catch (error) {
          console.error("사용자 정보를 가져오는데 실패했습니다:", error);
        }
      }
    };

    fetchUserInfo();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && role) {
      localStorage.setItem("role", role);
    }
  }, [isAuthenticated, role]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        user,
        logout,
        setIsAuthenticated,
        setRole,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
