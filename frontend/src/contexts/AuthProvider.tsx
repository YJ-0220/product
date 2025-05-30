import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

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

  useEffect(() => {
    if (isAuthenticated && role) {
      localStorage.setItem("role", role);
    }
  }, [isAuthenticated, role]);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        role, 
        logout,
        setIsAuthenticated,
        setRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};