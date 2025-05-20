import { useState } from "react";
import axios from "axios";

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);

      return res.data;
    } catch (error) {
      setError("로그인에 실패했습니다.");
      throw error;
    }
  };

  return { login, error };
};
