import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: apiBaseUrl + "/api",
  withCredentials: true,
});

export default api;
