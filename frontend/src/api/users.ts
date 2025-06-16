import api from "./axios";

export const getUserProfile = async () => {
  const res = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};
