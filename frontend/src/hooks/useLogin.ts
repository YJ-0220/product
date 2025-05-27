import { useState } from "react";
import { loginRequest } from "@/api/auth";

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const data = await loginRequest(username, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      setError(null);
      return data;
    } catch (e) {
      setError("로그인에 실패했습니다.");
      throw e;
    }
  };

  return { login, error };
};
