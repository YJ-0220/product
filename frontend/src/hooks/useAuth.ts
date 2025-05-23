import { useState } from "react";
import { loginRequest } from "../api/auth";

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const data = await loginRequest(username, password);

      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      setError("로그인에 실패했습니다.");
      throw error;
    }
  };

  return { login, error };
};
