import { useState } from "react";
import { loginRequest } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setRole } = useAuth();
  
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const data = await loginRequest(username, password);
      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      
      setIsAuthenticated(true);
      setRole(user.role);

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "seller") {
        navigate("/seller");
      } else if (user.role === "buyer") {
        navigate("/home");
      }

      setError(null);

      return user;
    } catch (e) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      throw e;
    }
  };

  return { login, error };
};
