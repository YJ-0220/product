import { useState } from "react";
import { loginRequest } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "./useLoading";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();
  const { withLoading, loading } = useLoading();

  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // 로그인 함수
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
      if (username === "" || password === "") {
        setError("아이디와 비밀번호를 입력해주세요.");
      } else {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
      throw e;
    }
  };

  // 위에 login 함수를 사용
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await withLoading(() => login(username, password));
    } catch (error) {
      console.error(error);
    }
  };

  return {
    error,
    loading,
    username,
    password,
    setUsername,
    setPassword,
    handleLoginSubmit,
  };
};
