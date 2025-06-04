import { useState } from "react";
import { loginRequest } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const data = await loginRequest(username, password);
      const { token, user } = data;
      const role = user.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setIsAuthenticated(true);

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "seller") {
        navigate("/seller");
      } else if (role === "buyer") {
        navigate("/buyer");
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
