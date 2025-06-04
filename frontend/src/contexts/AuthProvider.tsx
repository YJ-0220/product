import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { getUserProfile } from "@/api/users";

interface User {
  id: string;
  name: string;
  role: string;
  membershipLevel?: string;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    return !!(token && localStorage.getItem("role"));
  });

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const res = await getUserProfile();
          setUser(res.user);
        } catch (error) {
          console.error("사용자 정보를 가져오는데 실패했습니다:", error);
          localStorage.clear();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("role", user?.role || "");
    }
  }, [isAuthenticated, user]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        logout,
        setIsAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
