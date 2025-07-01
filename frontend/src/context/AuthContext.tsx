import { createContext, useContext } from "react";
import type { User } from "@/types/userTypes";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  logout: () => void;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
