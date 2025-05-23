import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const loginRequest = async (username: string, password: string) => {
  const res = await api.post("/auth/login", {
    username,
    password,
  });

  return res.data;
};
