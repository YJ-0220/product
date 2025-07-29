import { create } from "zustand";
import { getUserProfile } from "@/api/users";
import { loginRequest } from "@/api/auth";
import type { User } from "@/types/userTypes";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  fetchUserInfo: () => Promise<void>;
  logout: () => void;
  setAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const initialAuth = !!token && !!role;

  const store = {
    isAuthenticated: initialAuth,
    user: null,
    loading: initialAuth,
    error: null,

    login: async (username: string, password: string) => {
      try {
        set({ loading: true, error: null });
        const { token } = await loginRequest(username, password);
        localStorage.setItem("token", token);
        set({ isAuthenticated: true });

        const res = await getUserProfile();
        const userData = { ...res.user, points: Number(res.points) };
        localStorage.setItem("role", userData.role || "");
        set({ user: userData });
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "로그인에 실패했습니다.";

        set({
          isAuthenticated: false,
          user: null,
          error: errorMessage,
        });
        localStorage.clear();
      } finally {
        set({ loading: false });
      }
    },

    fetchUserInfo: async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        set({ loading: false, isAuthenticated: false });
        return;
      }

      try {
        set({ loading: true });
        const res = await getUserProfile();
        const userData = { ...res.user, points: Number(res.points) };
        localStorage.setItem("role", userData.role || "");
        set({ user: userData, isAuthenticated: true, error: null });
      } catch (err: any) {
        let errorMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";
        
        if (err.response?.status === 401) {
          errorMessage = "토큰이 만료되었습니다. 다시 로그인해주세요.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        
        localStorage.clear();
        set({ 
          isAuthenticated: false, 
          user: null, 
          error: errorMessage 
        });
      } finally {
        set({ loading: false });
      }
    },

    logout: () => {
      localStorage.clear();
      set({ user: null, isAuthenticated: false });
      window.location.href = "/login";
    },

    setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
    setUser: (user: User | null) => set({ user }),
    clearError: () => set({ error: null }),
  };

  if (initialAuth) {
    setTimeout(() => {
      store.fetchUserInfo();
    }, 0);
  }

  return store;
});
