import { useState } from "react";
import { loginRequest } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();

  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const data = await loginRequest(username, password);
      const { token, user } = data;
      const role = user.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setIsAuthenticated(true);
      setUser(user);

      navigate("/");

      setError(null);

      return user;
    } catch (e) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      throw e;
    }
  };

  return { login, error };
};
