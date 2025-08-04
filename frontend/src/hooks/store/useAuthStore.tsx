import { create } from "zustand";
import { getUsers } from "@/api/users";
import { loginRequest } from "@/api/auth";
import type { User } from "@/types/userTypes";

// JWT 토큰을 디코딩하는 함수
const decodeJWTPayload = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};

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

        const res = await getUsers();
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
        set({ loading: true, error: null });
        
        // 방법 1: JWT 디코딩으로 빠른 UI (보안 검증 없음)
        const decoded = decodeJWTPayload(token);
        
        if (decoded && decoded.userId && decoded.role) {
          // 임시 사용자 정보로 UI 먼저 렌더링
          const tempUserData = {
            id: decoded.userId,
            username: decoded.username || "",
            role: decoded.role,
            membershipLevel: decoded.membershipLevel || "bronze",
            points: 0,
          };
          
          localStorage.setItem("role", tempUserData.role);
          set({ 
            user: tempUserData, 
            isAuthenticated: true, 
            error: null,
            loading: false  // 로딩 상태 해제로 빠른 UI
          });
          
          // 방법 2: 서버 검증으로 실제 데이터 확인 (보안 검증 포함)
          try {
            const res = await getUsers(); // 🔒 서버에서 JWT 검증
            const verifiedUserData = { ...res.user, points: Number(res.points) };
            set({ user: verifiedUserData }); // 검증된 데이터로 업데이트
          } catch (verifyError: any) {
            // 서버 검증 실패시 로그아웃 처리
            if (verifyError.response?.status === 401) {
              console.warn('서버 검증 실패, 로그아웃 처리');
              localStorage.clear();
              set({ isAuthenticated: false, user: null });
            }
          }
          
          return;
        }
        
        // JWT 디코딩 실패시 완전히 서버 검증 방식 사용
        const res = await getUsers();
        const userData = { ...res.user, points: Number(res.points) };
        localStorage.setItem("role", userData.role || "");
        set({ user: userData, isAuthenticated: true, error: null });
        
      } catch (err: any) {
        let errorMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";

        if (err.response?.status === 401) {
          errorMessage = "인증 정보가 만료되었습니다. 다시 로그인해주세요.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }

        localStorage.clear();
        set({
          isAuthenticated: false,
          user: null,
          error: errorMessage,
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
